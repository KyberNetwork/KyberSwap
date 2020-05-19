import React, { Fragment } from "react"
import { connect } from "react-redux"
import { getWallet } from "../../services/keys";
import { importLoading, closeImportLoading, importNewAccount } from "../../actions/accountActions";
import { getTranslate } from "react-localize-redux";
import { openInfoModal } from "../../actions/utilActions";

@connect((store) => {
  return {
    ethereum: store.connection.ethereum,
    translate: getTranslate(store.locale)
  }
})
export default class ImportByTorus extends React.Component {
  async connect() {
    const walletType = 'torus';
    const wallet = getWallet(walletType);
    
    this.props.dispatch(importLoading());
    
    try {
      await wallet.initiateWallet();
    } catch (e) {
      console.log(e);
      const titleModal = this.props.translate('error_text') || 'Error';
      const contentModal = this.props.translate('error.torus_connect_error') || 'Cannot connect to Torus';
      this.props.dispatch(openInfoModal(titleModal, contentModal));
      
      this.props.dispatch(closeImportLoading());
      
      return;
    }
    
    const address = wallet.address;

    this.props.dispatch(importNewAccount(
      address,
      walletType,
      null,
      this.props.ethereum,
      null,
      null,
      wallet.getWalletName(),
      null,
      wallet
    ));
  }
  
  render() {
    return (
      <Fragment>
        {!this.props.isOnMobile && (
          <div className="import-account__block theme__import-button" onClick={() => this.connect()}>
            <div className="import-account__icon torus"/>
            <div className="import-account__name">Torus</div>
          </div>
        )}
        
        {this.props.isOnMobile && (
          <div className={"import-account__block theme__import-button"}>
            <div className={"import-account__block-left"}>
              <div className="import-account__icon torus"/>
              <div>
                <div className="import-account__name">Torus</div>
                <div className="import-account__desc">
                  {this.props.translate("address.import_address") || "Access your Wallet"}
                </div>
              </div>
            </div>
            <div className="import-account__block-right" onClick={() => this.connect()}>
              {this.props.translate("address.enter") || "Enter"}
            </div>
          </div>
        )}
      </Fragment>
    )
  }
}
