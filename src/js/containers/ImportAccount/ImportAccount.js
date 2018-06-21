import React from "react"
import { connect } from "react-redux"


import { importAccountMetamask } from "../../actions/accountActions"

import { LandingPage, ImportAccountView } from '../../components/ImportAccount'
import {
  ImportKeystore, ImportByDevice, ImportByPrivateKey,
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor
} from "../ImportAccount"

import {visitExchange} from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux'


import Web3Service  from "../../services/web3"
import BLOCKCHAIN_INFO from "../../../../env"


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
    ethereum: store.connection.ethereum,
    tokens: supportTokens,
    translate: getTranslate(store.locale)
  }
})

export default class ImportAccount extends React.Component {

  constructor(){
    super()
    this.state = {
      isOpen: false,
      isInLandingPage: true
    }
  }

  goExchange = (e) => {
    this.setState({
      isInLandingPage: false
    })
  }

  componentDidMount = () => {
    // if (typeof web3 !== "undefined") {
    //     var web3Service = new Web3Service(web3)
    //     var walletType = web3Service.getWalletType()
    //     if (walletType !== "metamask"){
    //       this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
    //         this.props.ethereum, this.props.tokens, this.props.translate, walletType))       
    //     }
    //   }   
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
    if (this.state.isInLandingPage) {
      content =  <LandingPage goExchange={this.goExchange} translate={this.props.translate}/>
    } else {
      content =  (
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
