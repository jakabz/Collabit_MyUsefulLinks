import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'UsefulLinksWebPartStrings';
import UsefulLinks from './components/UsefulLinks';
import { IUsefulLinksProps } from './components/IUsefulLinksProps';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export interface IUsefulLinksWebPartProps {
  title: string;
  absoluteUrl: string;
  myLinks: any;
}

export default class UsefulLinksWebPart extends BaseClientSideWebPart<IUsefulLinksWebPartProps> {

  private listResult;
  private listInit = false;

  public onInit<T>(): Promise<T> {
    let query = '';
    query += '$filter=AuthorId eq ' + this.context.pageContext.legacyPageContext.userId +'&';
    query += '$orderby=Position asc';
    this._getListData(query).then((response) => {
      this.listResult = response.value;
      this.listInit = true;
      this.render();
    });
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IUsefulLinksProps > = React.createElement(
      UsefulLinks,
      {
        title: this.properties.title,
        absoluteUrl: this.context.pageContext.site.absoluteUrl,
        myLinks: this.listResult,
      }
    );
    if(this.listInit){
      ReactDom.render(element, this.domElement);
    }
  }

  private _getListData(query:string): Promise<any> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/Lists/GetByTitle('My Useful Links')/Items?` + query, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
