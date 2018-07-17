
import React from "react"
import { ImportByDevice } from "../ImportAccount"
import { Ledger } from "../../services/keys"

import { ImportByLedgerView } from "../../components/ImportAccount"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    screen: props.screen
  }
})

export default class ImportByDeviceWithLedger extends React.Component {
  deviceService = new Ledger()
  
  showLoading = (walletType) => {
    this.refs.child.getWrappedInstance().showLoading(walletType)
  }
  
  render = () => {
    var importContent = (
    <ImportByLedgerView 
      showLoading={this.showLoading}
      translate={this.props.translate}
      />)
  
    return(
      <ImportByDevice ref="child"
        deviceService={this.deviceService} 
        content={importContent}
        screen = {this.props.screen}
      />
    )
  }
}