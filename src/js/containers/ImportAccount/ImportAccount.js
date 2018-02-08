import React from "react"
import { connect } from "react-redux"

import { LandingPage, ImportAccountView } from '../../components/ImportAccount'
import {
  ImportKeystore, ImportByDevice, ImportByPrivateKey,
  ErrorModal, ImportByMetamask,
  ImportByDeviceWithLedger, ImportByDeviceWithTrezor
} from "../ImportAccount"

import {visitExchange} from "../../actions/globalActions"
import { getTranslate } from 'react-localize-redux'

@connect((store) => {
  return {
    ...store.account,
    translate: getTranslate(store.locale),
    isVisitFirstTime: store.global.isVisitFirstTime
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