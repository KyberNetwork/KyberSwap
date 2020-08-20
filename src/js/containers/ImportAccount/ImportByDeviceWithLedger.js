import React from "react"
import { ImportByDevice } from "../ImportAccount"
import { Ledger } from "../../services/keys"
import { ImportByLedgerView } from "../../components/ImportAccount"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import { LEDGER_DERIVATION_PATHS } from "../../services/constants";

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    screen: props.screen,
    analytics: store.global.analytics
  }
})
export default class ImportByDeviceWithLedger extends React.Component {
  deviceService = new Ledger();

  showLoading = (walletType) => {
    this.refs.child.showLoading(walletType)
    this.props.analytics.callTrack("trackClickImportAccount", walletType, this.props.tradeType);
  }
  
  render = () => {
    return(
      <ImportByDevice
        ref="child"
        dpaths={LEDGER_DERIVATION_PATHS}
        defaultPath={LEDGER_DERIVATION_PATHS[0]}
        deviceService={this.deviceService} 
        content={(
          <ImportByLedgerView
            showLoading={this.showLoading}
            translate={this.props.translate}
          />
        )}
        screen = {this.props.screen}
      />
    )
  }
}
