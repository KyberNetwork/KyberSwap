import PrivateKey from "./privateKey";

export default class Keystore extends PrivateKey {
  getWalletName = () => {
    return 'Keystore';
  }
}
