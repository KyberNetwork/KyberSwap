import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as actions from "../../actions/accountActions"
import { Modal } from "../../components/CommonElement"
import QRCode from "qrcode.react"
import { getWallet } from "../../services/keys"
import BLOCKCHAIN_INFO from "../../../../env";
import { findNetworkName } from "../../utils/converter";

const walletType = "walletconnect";

@connect((store) => {
  return {
    account: store.account,
    ethereum: store.connection.ethereum,
    translate: getTranslate(store.locale),
    metamask: store.global.metamask,
    analytics: store.global.analytics
  }
})
export default class ImportByWalletConnect extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isOpen: false,
      qrCode: "",
      wallet: false
    }
  }
  
  componentDidMount() {
    const wallet = getWallet(walletType);
    wallet.clearSession();
  }
  
  async connect() {
    var wallet = this.state.wallet;
    try {
      var chainId = await wallet.getChainId();
      
      this.props.closeParentModal();
      this.closeModal();
      
      if (chainId !== true) {
        this.errorHandling(chainId, BLOCKCHAIN_INFO.networkId)
      }
    } catch (err) {
      console.log(err)
    }
  }
  
  errorHandling = (chainId, networkId) => {
    const {translate} = this.props;
    const wallet = this.state.wallet;
    
    try {
      const currentId = parseInt(chainId, 10);
      
      if (currentId !== networkId) {
        var currentName = findNetworkName(currentId);
        var expectedName = findNetworkName(networkId);
        
        if (currentName) {
          this.props.dispatch(actions.throwError(translate("error.network_not_match_wallet_link", {
            currentName: currentName,
            expectedName: expectedName
          }) || "Network is not match"))
        } else {
          this.props.dispatch(actions.throwError(translate("error.network_not_match_unknow_wallet_link", {expectedName: expectedName}) || "Network is not match"))
        }
        
        wallet.clearSession();
        return
      }
      
      const address = wallet.getAddress();
      
      this.props.dispatch(actions.importNewAccount(
        address.toLowerCase(),
        walletType,
        null,
        this.props.ethereum,
        null,
        null,
        "Wallet Connect"
      ))
    } catch (e) {
      console.log(e);
      this.props.dispatch(actions.throwError("Cannot get wallet account."))
    }
  };
  
  async openQrCode() {
    const wallet = getWallet(walletType);
    
    try {
      var qrCode = await wallet.requestQrCode();
      this.setState({
        qrCode: qrCode,
        isOpen: true,
        wallet: wallet
      });
      this.connect()
    } catch (err) {
      console.log(err)
    }
  }
  
  closeModal = () => {
    this.setState({isOpen: false})
  };
  
  contentModal = () => {
    return (
      <div className="wallet-connect-qr p-a-20px import-promocode">
        <div>
          <div className="title">Scan QR code</div>
          <div className="x" onClick={() => {
            this.props.closeParentModal();
            this.closeModal()
          }}>&times;</div>
          <div className="content with-overlap">
            <div className="row">
              <QRCode size={300} value={this.state.qrCode}/>
            </div>
            <div className="message">
              <div><span className={"theme__background-3"}>1</span> {`Open compatible wallet app`}</div>
              <div><span className={"theme__background-3"}>2</span> {`Find and open the QR scanner`}</div>
              <div><span className={"theme__background-3"}>3</span> {`Scan this QR code`}</div>
            </div>
          </div>
        </div>
      </div>
    )
  };
  
  render() {
    return (
      <div>
        <div className="import-account__block theme__import-button" onClick={() => this.openQrCode()}>
          <div className="import-account__icon wallet-connect"/>
          <div className="import-account__name">WalletConnect</div>
        </div>
        {this.state.isOpen === true && (
          <Modal
            className={{
              base: 'reveal tiny',
              afterOpen: 'reveal tiny'
            }}
            isOpen={true}
            onRequestClose={() => {
              this.props.closeParentModal();
              this.closeModal()
            }}
            contentLabel="approve token"
            content={this.contentModal()}
            size="medium"
          />
        )}
      </div>
    )
  }
}
