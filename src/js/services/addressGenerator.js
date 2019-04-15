import ethUtil from "ethereumjs-util";
import HDKey from "hdkey";

export default class AddressGenerator {

    constructor(data) {
        this.hdk = new HDKey();
        this.hdk.publicKey = new Buffer(data.publicKey, 'hex');
        this.hdk.chainCode = new Buffer(data.chainCode, 'hex');
    }

    getAddressString(index) {
        let derivedKey = this.hdk.derive(`m/${index}`);
        let address = ethUtil.publicToAddress(derivedKey.publicKey, true);
        let addressString = '0x' + address.toString('hex');
        return addressString;
    }

}
