import React from "react"
import { connect } from "react-redux"

import { LandingPage, ImportAccountView } from '../../components/ImportAccount'
import {
  ImportKeystore, ImportByDevice, ImportByPrivateKey,
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor
} from "../ImportAccount"

import { importAccountMetamask } from "../../actions/accountActions"
import {visitExchange} from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux'
import Web3Service from "../../services/web3"
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
    tokens: supportTokens,
    ethereum: store.connection.ethereum,
    translate: getTranslate(store.locale)
  }
})

export default class ImportAccount extends React.Component {

  constructor(){
    super()
    this.state = {
      isInLandingPage: true
    }
  }

  goExchange = (e) => {
    this.setState({
      isInLandingPage: false
    })
  }

  componentDidMount = () => {
    if (typeof web3 !== "undefined") {
        var web3Service = new Web3Service(web3)
        if(web3Service.isTrust()){
          this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
            this.props.ethereum, this.props.tokens, this.props.translate))       
        }
      }   
    }

  render() {

      

    if (this.state.isInLandingPage) {
      return <LandingPage goExchange={this.goExchange} translate={this.props.translate}/>
    } else {
      return (
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
}