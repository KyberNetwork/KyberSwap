import React from "react";
import { connect } from "react-redux";
import Trezor from "../../services/trezor/trezor";
import { connectLedger, getLedgerPublicKey } from "../../services/ledger";
import SelectAddressModal from "../CommonElements/SelectAddressModal";


@connect((store) => {
    return { ...store.account }
})

export default class ImportTrezor extends React.Component {

    constructor() {
        super();
        this.state = {
            defaultDPath: "m/44'/60'/0'/0", // first address: m/44'/60'/0'/0/0,
            ledgerPath: "m/44'/60'/0'", // first address: m/44'/60'/0'/0/0,
            addresses: [],
            currentAddresses: [],
            modalOpen: false,
        }
        this.setDeviceState();
    }

    connectDevice(walletType) {
        this.setDeviceState()
        switch (walletType) {
            case 'trezor': {
                let promise = this.trezorInstance.getPubData();
                promise.then((result) => {
                    this.generateAddress(result);
                })
            }
            case 'ledger': {
                console.log('ok')
                let path = this.state.ledgerPath;
                connectLedger(path).then((eth) => {
                    getLedgerPublicKey(eth, path).then((result) => {
                        console.log(result)
                    })
                })
            }
        }
    }

    setDeviceState() {
        this.addressIndex = 0;
        this.currentIndex = 0;
        this.trezorInstance = new Trezor;
    }

    generateAddress(statusConnect) {
        let addresses = [];
        if (statusConnect == 'Success') {
            let index = 0;
            for (index; index < 5; index++) {
                let addressString = this.trezorInstance.getAddressString(index);
                addresses.push(addressString);
            }
            this.addressIndex = index;
            this.currentIndex += 5;

            this.setState({
                addresses: addresses,
                currentAddresses: addresses.slice(this.currentIndex - 5, this.currentIndex)
            })
            this.openModal();
        }
    }

    openModal() {
        this.setState({
            modalOpen: true,
        })
    }

    closeModal() {
        this.setState({
            modalOpen: false,
        })
    }

    moreAddress() {
        let addresses = this.state.addresses,
            i = this.addressIndex,
            j = i + 5;
        if (this.addressIndex == this.currentIndex) {
            for (i; i < j; i++) {
                let addressString = this.trezorInstance.getAddressString(i);
                addresses.push(addressString);
            }
        }
        this.addressIndex = i;
        this.currentIndex += 5;

        this.setState({
            addresses: addresses,
            currentAddresses: addresses.slice(this.currentIndex - 5, this.currentIndex)
        })
    }

    preAddress() {
        let addresses = this.state.addresses;
        if (this.currentIndex > 5) {
            this.currentIndex -= 5;
            this.setState({
                currentAddresses: addresses.slice(this.currentIndex - 5, this.currentIndex)
            })
        }
    }

    render() {
        const currentList = this.state.currentAddresses.map((address) => {
            return (
                <li key={address}>
                    <input type="radio" name="address" value={address} />
                    <span> {address}</span>
                </li>
            )
        })

        return (
            <div>
                <a onClick={() => this.connectDevice('trezor')}>Import via Trezor</a>
                <br />
                <a onClick={() => this.connectDevice('ledger')}>Import via Ledger</a>

                <SelectAddressModal
                    open={this.state.modalOpen}
                    onRequestClose={this.closeModal.bind(this)}
                    content={
                        <div className="popup">
                            <ul>
                                {currentList}
                            </ul>
                            <a onClick={() => this.preAddress()}>Pre address</a> |
                            <a onClick={() => this.moreAddress()}> More address</a>
                        </div>
                    }
                />

            </div>
        )
    }
}
