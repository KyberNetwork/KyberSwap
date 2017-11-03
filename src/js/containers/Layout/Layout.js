import React from "react"
import { connect } from "react-redux"
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import InfoKyber from "../../components/InfoKyber"

import {Exchange} from "../../containers/Exchange"

import {Transfer} from "../../containers/Transfer"

import {Header} from "../../containers/Header"

import {ImportAccount} from "../ImportAccount"

import { Processing, InfoModal } from "../../containers/CommonElements/"
//import {  } from "../../containers/CommonElements"
import constanst from "../../services/constants"
import history from "../../history"
import { clearSession } from "../../actions/globalActions"
import { openInfoModal} from "../../actions/utilActions"
import { default as _ } from 'underscore';
import { LayoutView } from "../../components/Layout"

@connect((store) => {
  return {
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
    utils: store.utils,
    account: store.account
  }
})

export default class Layout extends React.Component {
  constructor() {
    super();
    this.idleTime = 0;
    this.timeoutEndSession = constanst.IDLE_TIME_OUT / 10;    // x10 seconds
    this.idleMode = false;
    this.intervalIdle = null;
  }
  componentWillMount() {
    this.props.ethereumNode.watch()
    
    document.onload = this.resetTimmer;
    document.onmousemove = this.resetTimmer;
    document.onmousedown = this.resetTimmer; // touchscreen presses
    document.ontouchstart = this.resetTimmer;
    document.onclick = this.resetTimmer;     // touchpad clicks
    document.onscroll = this.resetTimmer;    // scrolling with arrow keys
    document.onkeypress = this.resetTimmer;

    this.intervalIdle = setInterval(this.checkTimmer.bind(this), 10000)
  }

  checkTimmer(){
    if(!this.props.account.account) return;
    if(this.props.utils.infoModal && this.props.utils.infoModal.open) return;
    if(this.idleTime >= this.timeoutEndSession){
      this.props.dispatch(openInfoModal("Time out error", "We've cleared all your data because you idle over "+(constanst.IDLE_TIME_OUT / 60)+" minutes"));
      this.endSession();
    } else {
      //console.log("increase timmer ===")
      this.idleTime++;
    }
  }

  resetTimmer = _.throttle(this.doResetTimer.bind(this), 5000)

  doResetTimer(){
    this.idleTime = 0;
  }

  endSession(){
    this.props.dispatch(clearSession());    
  }

  render() {
    // var app = (
    //     <div>
    //       <Route component={Header}/>    
    //       <section id="content">
    //           <Route exact path="/" component={ImportAccount}/>              
    //           <Route exact path="/info" component={InfoKyber}/>                                          
    //           <Route exact path="/exchange" component={Exchange}/>
    //           <Route exact path="/transfer" component={Transfer}/>
    //           <Processing />
              
    //       </section>
    //       <section id="modals">
    //         <InfoModal/>
    //       </section>
    //       {}
    //     </div>
    //   )
   
    return (
      // <ConnectedRouter history={history}>
      //   <div>
      //     {app}
      //   </div>
      // </ConnectedRouter>
      <LayoutView
        history={history}
        Header={Header}
        ImportAccount={ImportAccount}
        InfoKyber={InfoKyber}
        Exchange={Exchange}
        Transfer={Transfer}
      />
    )
  }
}
