import React from "react"
import { ImportByDevice } from "../ImportAccount"
import { Trezor } from "../../services/keys"
import { ImportByTrezorView } from "../../components/ImportAccount"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import { TREZOR_DERIVATION_PATHS } from "../../services/constants";

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    screen: props.screen,
    analytics: store.global.analytics
  }
})
export default class ImportByDeviceWithTrezor extends React.Component {
  deviceService = new Trezor()
  
  showLoading = (walletType) => {
    this.refs.child.showLoading(walletType)
    this.props.analytics.callTrack("trackClickImportAccount", walletType, this.props.tradeType);
  }
  
  render = () => {
    return(
      <ImportByDevice
        ref="child"
        dpaths={TREZOR_DERIVATION_PATHS}
        defaultPath={TREZOR_DERIVATION_PATHS[0]}
        deviceService={this.deviceService} 
        content={(
          <ImportByTrezorView
            showLoading={this.showLoading}
            translate={this.props.translate}
          />
        )}
        screen={this.props.screen}
      />
    )
  }
}
