import React from "react"
import { connect } from "react-redux"
import { getWallet } from "../../services/keys";
import { importLoading, closeImportLoading, importNewAccount } from "../../actions/accountActions";
import { openInfoModal } from "../../actions/utilActions";

@connect((store) => {
  return { ethereum: store.connection.ethereum }
})
export default class ImportByTorus extends React.Component {
  async connect() {
    const walletType = 'torus';
    const wallet = getWallet(walletType);
    
    this.props.closeParentModal();
    this.props.dispatch(importLoading());
    
    await wallet.initiateWallet();
    const address = wallet.address;
    
    if (!address) {
      this.props.dispatch(closeImportLoading());
      
      const titleModal = this.props.translate('error_text') || 'Error';
      const contentModal = this.props.translate('error.torus_connect_error') || 'Cannot connect to Torus';
      this.props.dispatch(openInfoModal(titleModal, contentModal))
    }
  
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
      <div className="import-account__block theme__import-button" onClick={() => this.connect()}>
        <div className="import-account__icon torus"/>
        <div className="import-account__name">Torus</div>
      </div>
    )
  }
}
