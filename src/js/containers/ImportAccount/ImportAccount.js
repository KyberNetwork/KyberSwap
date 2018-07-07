import React from "react"
import { connect } from "react-redux"




import { LandingPage, ImportAccountView } from '../../components/ImportAccount'
import {
  ImportKeystore, ImportByDevice, ImportByPrivateKey,
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor
} from "../ImportAccount"

import { visitExchange } from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux'




@connect((store) => {  

  return {
    ...store.account,
    translate: getTranslate(store.locale),
    isVisitFirstTime: store.global.isVisitFirstTime,
    translate: getTranslate(store.locale),
    termOfServiceAccepted: store.global.termOfServiceAccepted
  }
})

export default class ImportAccount extends React.Component {

  constructor() {
    super()
    this.state = {
      isOpen: false,
      // isInLandingPage: true
    }
  }

  // goExchange = (e) => {
  //   this.setState({
  //     isInLandingPage: false
  //   })
  // }
  componentDidMount = () => {
    var swapPage = document.getElementById("swap-app")
    swapPage.className = swapPage.className === "" ? "no-min-height" : swapPage.className + " no-min-height"
  }

  // closeModal = (e) => {
  //   this.setState({isOpen: false})
  // }

  // openModal = (e) => {
  //   this.setState({isOpen: true})
  // }

  render() {
    // return (
    //   <div>
    //     <LandingPage goExchange={this.openModal} translate={this.props.translate}/>
    //     <ImportAccountView
    //       firstKey={<ImportByMetamask />}
    //       secondKey={<ImportKeystore />}
    //       thirdKey={<ImportByDeviceWithTrezor />}
    //       fourthKey={<ImportByDeviceWithLedger />}
    //       fifthKey={<ImportByPrivateKey />}
    //       errorModal={<ErrorModal />}
    //       translate={this.props.translate}
    //       isOpen = {this.state.isOpen}
    //       closeModal = {this.closeModal}
    //     />
    //   </div>
    // )    
    var content
    if (!this.props.termOfServiceAccepted) {
      content = <LandingPage translate={this.props.translate} />
    } else {
      content = (
        <ImportAccountView
          firstKey={<ImportByMetamask />}
          secondKey={<ImportKeystore />}
          thirdKey={<ImportByDeviceWithTrezor />}
          fourthKey={<ImportByDeviceWithLedger />}
          fifthKey={<ImportByPrivateKey />}
          errorModal={<ErrorModal />}
          translate={this.props.translate}
        />
      )
    }

    return (
      <div id="landing_page">{content}</div>
    )


  }
}
