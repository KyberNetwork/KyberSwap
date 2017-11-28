
import React from "react"
import { ImportByDevice } from "../ImportAccount"
import { Trezor } from "../../services/keys"

import { ImportByTrezorView } from "../../components/ImportAccount"

export default class ImportByDeviceWithTrezor extends React.Component {
  deviceService = new Trezor()
  
  showLoading = (walletType) => {
    this.refs.child.getWrappedInstance().showLoading(walletType)
  }
  
  render = () => {
    var importContent = (<ImportByTrezorView showLoading={this.showLoading}/>)
  
    return(
      <ImportByDevice ref="child"
        deviceService={this.deviceService} 
        content={importContent}
      />
    )
  }
}