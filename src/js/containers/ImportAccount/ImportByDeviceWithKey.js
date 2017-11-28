
import React from "react"
import { ImportByDevice } from "../ImportAccount"
import { Trezor, Ledger } from "../../services/keys"
import { connect } from "react-redux"
import { ImportByLedgerView, ImportByTrezorView } from "../../components/ImportAccount"

@connect((store, props) => {
  var walletType = props.walletType
  var deviceService
  switch (walletType) {
    case 'trezor': {
      deviceService = new Trezor()
      break;
    }
    case 'ledger': {
      deviceService = new Ledger()
      break;
    }
  }
  return {
    walletType: walletType,
    deviceService: deviceService
  }
})

export default class ImportByDeviceWithKey extends React.Component {

  showLoading = (walletType) => {
    this.refs.child.getWrappedInstance().showLoading(walletType)
  }

  render = () => {
    var importContent = (<div></div>)
    switch (this.props.walletType) {
      case 'trezor': {
        importContent = (
          <ImportByTrezorView showLoading={this.showLoading}/>
        )
        break;
      }
      case 'ledger': {
        importContent = (
          <ImportByLedgerView showLoading={this.showLoading}/>
        )
        break;
      }
    }
    return(
      <ImportByDevice ref="child"
        deviceService={this.props.deviceService} 
        content={importContent}
      />
    )
  }
}