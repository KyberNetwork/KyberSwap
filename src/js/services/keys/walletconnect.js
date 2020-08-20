import WalletConnect from "@walletconnect/browser";
import BaseWallet from "./BaseWallet";

export default class WalletConnectKey extends BaseWallet {
  constructor(props) {
    super(props);
    
    this.walletConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org"
    });
    this.address = null;
  }
  
  getDisconnected = () => {
    return this.subscribeToDisconnect();
  };
  
  clearSession = () => {
    this.walletConnector.killSession()
  };
  
  requestQrCode = () => {
    return new Promise((resolve, reject) => {
      if (!this.walletConnector.connected) {
        this.walletConnector.createSession().then(() => {
          // get uri for QR Code modal
          const uri = this.walletConnector.uri;
          resolve(uri)
        }).catch(err => {
          console.log(err);
          reject(err)
        })
      } else {
        const uri = this.walletConnector.uri;
        resolve(uri)
      }
    })
  };
  
  getAddress = () => {
    return this.address;
  };
  
  getChainId = () => {
    const onConnect = this.subscribeToConnect();
    const onDisconnect = this.subscribeToDisconnect();
    return Promise.race([onConnect, onDisconnect]);
  };
  
  subscribeToConnect = () => {
    return new Promise((resolve, reject) => {
      this.walletConnector.on("connect", (error, payload) => {
        if (error) {
          reject(error);
          return
        }
        
        const {accounts, chainId} = payload.params[0];
        
        this.address = accounts[0];
        
        resolve(chainId)
      });
    })
  };
  
  subscribeToDisconnect = () => {
    return new Promise((resolve, reject) => {
      this.walletConnector.on("disconnect", (error) => {
        if (error) {
          reject(error);
          return;
        }
        
        resolve(true);
      })
    });
  };
  
  sealTx = (txParams) => {
    return new Promise((resolve, reject) => {
      this.walletConnector.sendTransaction(txParams).then(transactionHash => {
        resolve(transactionHash)
      }).catch(err => {
        console.log(err);
        reject(err.message)
      })
    })
  };
  
  async signSignature(message, account) {
    try {
      return await this.walletConnector.signPersonalMessage([message, account.address]);
    } catch (err) {
      console.log(err);
      throw err
    }
  }
  
  getWalletName = () => {
    return 'Wallet Connect';
  }
}
