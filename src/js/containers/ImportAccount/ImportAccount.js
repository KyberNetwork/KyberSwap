import React from "react"
import { connect } from "react-redux"
import {  ImportAccountView, LandingPage } from '../../components/ImportAccount'
import {
  ImportKeystore, ImportByDevice, ImportByPrivateKey,
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor
} from "../ImportAccount"

import { visitExchange } from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux'


import { importAccountMetamask } from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"
import Web3Service from "../../services/web3"

//import platform from 'platform'
import {isMobile} from "../../utils/common"

@connect((store, props) => {  
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
    screen: props.screen,
    tradeType: props.tradeType
  }
})

export default class ImportAccount extends React.Component {

  constructor() {
    super()
    this.state = {
      isOpen: false,
      isAndroid: false,
      isIos: false
      // isInLandingPage: true
    }
  }

  // goExchange = (e) => {
  //   this.setState({
  //     isInLandingPage: false
  //   })
  // }

  componentDidMount = () => {
    // console.log("playform")
    // console.log(platform)

    var swapPage = document.getElementById("swap-app")
    swapPage.className = swapPage.className === "" ? "no-min-height" : swapPage.className + " no-min-height"

    
    //alert("web3")

    //check mobile, ios, android
    var web3Service = new Web3Service()
    if (!web3Service.isHaveWeb3()) {
      if (isMobile.iOS()){
        this.setState({isIos: true})
      }
  
      if (isMobile.Android()){
        this.setState({isAndroid: true})
      }
    }


    if (this.props.termOfServiceAccepted){
    
      if (web3Service.isHaveWeb3()) {
        
        //var web3Service = new Web3Service(web3)
        var walletType = web3Service.getWalletType()
     //   alert(walletType)
        if (walletType !== "metamask") {
          // /alert(walletType)
          this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
          this.props.ethereum, this.props.tokens, this.props.screen, this.props.translate, walletType))
        }
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
    var content
    if (!this.props.termOfServiceAccepted) {
      content = <LandingPage translate={this.props.translate} tradeType={this.props.tradeType}/>
    } else {
      if (this.state.isIos){
        content = (<div className="download-mobile">
          <div>
            <div className="mobile-icon">

            </div>
            <div className="mobile-title">
              <div>Coinbase Wallet</div>
              <div>Ethereum Wallet & DApp Browser</div>
            </div>
          </div>
          <div className="mobile-btn">
            <a>Download</a>
          </div>
        </div>)
      }
      if (this.state.isAndroid){
        content = <div>android</div>
      }
      if (!this.state.isIos && !this.state.isAndroid){
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
    }

    return (
      <div id="landing_page">{content}</div>
    )


  }
}
