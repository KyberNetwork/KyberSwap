import React, { Component } from "react"
import { connect } from "react-redux"
import { getWallet } from "../../services/keys";
import { importLoading, closeImportLoading, importNewAccount, throwError } from "../../actions/accountActions";

@connect((store) => {
  return {
    ethereum: store.connection.ethereum
  }
})
export default class ImportByPortis extends Component {
  async connect() {
    const walletType = 'portis';
    const wallet = getWallet(walletType);
  
    try {
      this.props.dispatch(importLoading());
      this.props.closeParentModal();
    
      const address = await wallet.getAddress();
    
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
    } catch (err) {
      console.log(err);
      this.props.dispatch(throwError(err));
      this.props.dispatch(closeImportLoading());
    }
  }
  
  render() {
    return (
      <div className="import-account__block theme__import-button" onClick={() => this.connect()}>
        <div className="import-account__icon portis"/>
        <div className="import-account__name">Portis</div>
      </div>
    )
  }
}
