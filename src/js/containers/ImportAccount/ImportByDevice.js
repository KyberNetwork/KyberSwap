import React from "react"
import { connect } from "react-redux"
import Trezor from "../../services/trezor"


@connect((store) => {
    return { ...store.account }
})

export default class ImportTrezor extends React.Component {

    constructor() {
        super();
        this.state = {
            defaultDPath: "m/44'/60'/0'/0", // first address: m/44'/60'/0'/0/0,
            addresses: [],
            currentWalletIndex: 0,
        }
        this.address_index = 0;
        this.abc = 0;

    }
    lowerCaseKey = (keystring) => {
        return keystring.toLowerCase();
    }

    trezor() {
        if (!this.trezorInstance) {
            this.trezorInstance = new Trezor;
        }
    }

    generateAddress() {
        this.trezor();
        let addresses = this.state.addresses;
        for (let i = 0; i < 5; i++) {
            let address = this.trezorInstance.generateAddress(0);
            if (typeof (address) != 'string') {
                address.then((result) => {
                    addresses.push(result);
                    console.log(addresses)
                })
            } else {
                addresses.push(result);
                console.log(addresses)
            }

        }

    }

    moreAddress() {
        let addresses = this.state.addresses,
            i = this.address_index + 1,
            j = i + 5;
        console.log(this.address_index);
        for (i; i < j; i++) {
            let path = this.state.defaultDPath + `/${i}`,
                derivedKey = this.hdk.derive(`m/${i}`);

            this.address_index = i;

            let address = ethUtil.publicToAddress(derivedKey.publicKey, true);
            let addressString = '0x' + address.toString('hex');

            addresses.push(addressString);
        }

        this.setState({
            wallets: addresses,
            currentWalletIndex: this.address_index
        })
    }

    render() {
        return (
            <div>
                <a onClick={() => this.generateAddress()}>Import via Trezor</a>
                <div className="popup">
                    <ul>
                        {this.state.addresses.map((address) => {
                            return (
                                <li key={address}>
                                    <input type="radio" name="address" value={address} />
                                    <span> {address}</span>
                                </li>
                            )
                        })}
                    </ul>
                    <a onClick={() => this.preAddress()}>Pre address</a> |
                    <a onClick={() => this.nextAddress()}> Next address</a> |
                    <a onClick={() => this.moreAddress()}> More address</a>
                </div>
            </div>
        )
    }
}
