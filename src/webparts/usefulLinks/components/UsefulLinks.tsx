import * as React from 'react';
import styles from './UsefulLinks.module.scss';
import { IUsefulLinksProps } from './IUsefulLinksProps';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class UsefulLinks extends React.Component<IUsefulLinksProps, {}> {
  
  private openNewEvent = () => {
    window.open( this.props.absoluteUrl + '/Lists/MyUsefulLinks/AllItems.aspx');
  }
  private items:any;
  
  public render(): React.ReactElement<IUsefulLinksProps> {
    //console.info(this.props.myLinks);
    if(this.items = this.props.myLinks){
      this.items = this.props.myLinks.map((item, key) => {
        let target = item.OpenNewWindow ? '_blank' : 'self';
        return <div className={styles.userfulLinksItem}><a href={item.Url} target={target} className={styles.userfulLink}>{item.Title}</a></div>;
      });
    }
    
    return (
      <div className={ styles.usefulLinks }>
        <div className={styles.wptitle}>
          <Icon iconName='Link' className={styles.wptitleIcon} />
          <span>{this.props.title}</span>
          <div className={styles.addEventContainer} title="Edit links" onClick={this.openNewEvent}>
            <Icon iconName='Settings' className={styles.wptitleIcon} />
          </div>
        </div>
        <div className={styles.userfulLinksItems}>
          {this.items}
        </div>
      </div>
    );
  }
}
