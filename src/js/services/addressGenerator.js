import * as ethUtil from "ethereumjs-util";
import HDKey from "hdkey";

export default class AddressGenerator {
  constructor(data, selectedPath, getPublicKey) {
    this.setHdKey(data.publicKey, data.chainCode);
    this.selectedPath = selectedPath;
    this.getPublicKey = getPublicKey;
  }

  async getAddressString(index) {
    let derivedPath = `m/${index}`;

    if (this.selectedPath.bip44 && this.getPublicKey) {
      derivedPath = 'm/0/0';
      const path = `${this.selectedPath.value}/${index}'`;
      const { publicKey, chainCode } = await this.getPublicKey(path, false, true);
      this.setHdKey(publicKey, chainCode);
    }

    let derivedKey = this.hdk.derive(derivedPath);
    let address = ethUtil.publicToAddress(derivedKey.publicKey, true);

    return '0x' + address.toString('hex');
  }

  setHdKey(publicKey, chainCode) {
    this.hdk = new HDKey();
    this.hdk.publicKey = new Buffer(publicKey, 'hex');
    this.hdk.chainCode = new Buffer(chainCode, 'hex');
  }
}