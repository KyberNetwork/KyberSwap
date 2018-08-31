
import React from "react"
import { ImportByDevice } from "../ImportAccount"
import { Trezor } from "../../services/keys"

import { ImportByTrezorView } from "../../components/ImportAccount"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as analytics from "../../utils/analytics"

@connect((store) => {
  return {
    translate: getTranslate(store.locale)
  }
})
export default class ImportByDeviceWithTrezor extends React.Component {
  deviceService = new Trezor()
  
  showLoading = (walletType) => {
    this.refs.child.getWrappedInstance().showLoading(walletType)
    analytics.trackClickImportAccount(walletType)
  }
  
  render = () => {
    var importContent = (
    <ImportByTrezorView 
    showLoading={this.showLoading}
    translate={this.props.translate}
    />)
  
    return(
      <ImportByDevice ref="child"
        deviceService={this.deviceService} 
        content={importContent}
      />
    )
  }
}