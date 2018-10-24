import React from "react"
import { connect } from "react-redux"




import { LandingPage, ImportAccountView } from '../../components/ImportAccount'
import {
  ImportKeystore, ImportByDevice, ImportByPrivateKey,
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor, ImportByPromoCode
} from "../ImportAccount"

import { visitExchange, setOnMobile } from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux'


import { importAccountMetamask } from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"
import Web3Service from "../../services/web3"
import {isMobile} from "../../utils/common"

@connect((store) => {  
  var tokens = store.tokens.tokens
	var supportTokens = []
	Object.keys(tokens).forEach((key) => {
		supportTokens.push(tokens[key])
  })
  
  return {
    ...store.account,
    translate: getTranslate(store.locale),
    isVisitFirstTime: store.global.isVisitFirstTime,
    translate: getTranslate(store.locale),
    termOfServiceAccepted: store.global.termOfServiceAccepted,
    ethereum: store.connection.ethereum,
    tokens: supportTokens,
    onMobile: store.global.onMobile
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
    
    var web3Service = new Web3Service()
    if (this.props.termOfServiceAccepted){
      if (web3Service.isHaveWeb3()) {
        //var web3Service = new Web3Service(web3)
        var walletType = web3Service.getWalletType()
     //   alert(walletType)
        if (walletType !== "metamask") {
          // /alert(walletType)
          this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
          this.props.ethereum, this.props.tokens, this.props.translate, walletType))
        }
      }
    }
    if (!web3Service.isHaveWeb3()) {
      if (isMobile.iOS()) {
        this.props.dispatch(setOnMobile(true, false));
      } else if (isMobile.Android()) {
        this.props.dispatch(setOnMobile(false, true));
      }
    }
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
          sixthKey = {<ImportByPromoCode />}
          errorModal={<ErrorModal />}
          translate={this.props.translate}
          onMobile={this.props.onMobile}
        />
      )
    }

    return (
      <div id="landing_page">{content}</div>
    )


  }
}
