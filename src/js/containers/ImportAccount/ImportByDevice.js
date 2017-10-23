import React from "react";
import AddressGenerator from "../../services/device/addressGenerator";
import { getTrezorPublicKey, connectLedger, getLedgerPublicKey } from "../../services/device/device";
import SelectAddressModal from "../CommonElements/SelectAddressModal";

export default class ImportTrezor extends React.Component {

    constructor() {
        super();
        this.state = {
            addresses: [],
            currentAddresses: [],
            modalOpen: false,
        }
        this.setDeviceState();
    }

    setDeviceState() {
        this.addressIndex = 0;
        this.currentIndex = 0;
        this.generator = null;
    }

    connectDevice(walletType) {
        this.setDeviceState()
        switch (walletType) {
            case 'trezor': {
                let promise = getTrezorPublicKey();
                promise.then((result) => {
                    this.generateAddress(result);
                })
                break;
            }
            case 'ledger': {
                connectLedger().then((eth) => {
                    getLedgerPublicKey(eth).then((result) => {
                        this.generateAddress(result);
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                    console.log(err)
                });
                break;
            }
        }
    }

    generateAddress(data) {
        this.generator = new AddressGenerator(data);
        let addresses = [];
        let index = 0;
        for (index; index < 5; index++) {
            let addressString = this.generator.getAddressString(index);
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
                let addressString = this.generator.getAddressString(i);
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
                <a onClick={this.connectDevice.bind(this, 'trezor')}>Import via Trezor</a>
                <br />
                <a onClick={this.connectDevice.bind(this, 'ledger')}>Import via Ledger</a>

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
