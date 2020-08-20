import React from "react"
import { connect } from "react-redux"
import { importAccountMetamask, throwError } from "../../actions/accountActions"
import BLOCKCHAIN_INFO from "../../../../env"
import * as web3Package from "../../services/web3"
import { getTranslate } from 'react-localize-redux'

@connect((store) => {
  return {
    ethereum: store.connection.ethereum,
    translate: getTranslate(store.locale),
    analytics: store.global.analytics
  }
})
export default class ImportByMetamask extends React.Component {
  connect = () => {
    this.props.analytics.callTrack("trackClickImportAccount", "metamask", this.props.tradeType);

    var web3Service = web3Package.newWeb3Instance()

    if (web3Service === false) {
      this.props.dispatch(throwError(this.props.translate('error.metamask_not_install') || 'Cannot connect to metamask. Please make sure you have metamask installed'))
      return
    }

    this.dispatchAccMetamask(web3Service);
  };

  dispatchAccMetamask(web3Service){
    this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
      this.props.ethereum, this.props.translate, this.props.screen))
  }

  render() {
    return (
      <div className="import-account__block theme__import-button" onClick={() => this.connect()}>
        <div className="import-account__icon metamask"/>
        <div className="import-account__name">{this.props.translate("import.from_metamask") || "METAMASK"}</div>
      </div>
    )
  }
}
