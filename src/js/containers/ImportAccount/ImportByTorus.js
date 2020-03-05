import React from "react"
import { connect } from "react-redux"
import { getWallet } from "../../services/keys";
import { importNewAccount } from "../../actions/accountActions";

@connect((store) => {
  return { ethereum: store.connection.ethereum }
})
export default class ImportByTorus extends React.Component {
  async connect() {
    const walletType = 'torus';
    const wallet = getWallet(walletType);
    const address = await wallet.getAddress();
    
    this.props.closeParentModal();
  
    this.props.dispatch(importNewAccount(
      address.toLowerCase(),
      walletType,
      null,
      this.props.ethereum,
      null,
      null,
      "Wallet Link"
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
