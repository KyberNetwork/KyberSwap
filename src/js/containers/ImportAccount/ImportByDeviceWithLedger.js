
import React from "react"
import { ImportByDevice } from "../ImportAccount"
import { Trezor, Ledger } from "../../services/keys"

import { ImportByLedgerView } from "../../components/ImportAccount"

export default class ImportByDeviceWithLedger extends React.Component {
  deviceService = new Ledger()
  
  showLoading = (walletType) => {
    this.refs.child.getWrappedInstance().showLoading(walletType)
  }
  
  render = () => {
    var importContent = (<ImportByLedgerView showLoading={this.showLoading}/>)
  
    return(
      <ImportByDevice ref="child"
        deviceService={this.deviceService} 
        content={importContent}
      />
    )
  }
}