import React from "react"
import { connect } from "react-redux"
import { getWallet } from "../../services/keys";
import { importLoading, closeImportLoading, importNewAccount } from "../../actions/accountActions";

@connect((store) => {
  return { ethereum: store.connection.ethereum }
})
export default class ImportByTorus extends React.Component {
  async connect() {
    const walletType = 'torus';
    const wallet = getWallet(walletType);
    
    this.props.closeParentModal();
    this.props.dispatch(importLoading());
    
    try {
      await wallet.initiateWallet();
    } catch (e) {
      console.log(e);
      this.props.dispatch(closeImportLoading());
      wallet.clearSession();
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
      <div className="import-account__block theme__import-button" onClick={() => this.connect()}>
        <div className="import-account__icon torus"/>
        <div className="import-account__name">Torus</div>
      </div>
    )
  }
}
