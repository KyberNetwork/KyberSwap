import React from "react";
import { connect } from "react-redux"
import { push } from 'react-router-redux';

import AddressGenerator from "../../services/device/addressGenerator";
import { getTrezorPublicKey, connectLedger, getLedgerPublicKey } from "../../services/device/device";
import SelectAddressModal from "../CommonElements/SelectAddressModal";

import { importNewAccount } from "../../actions/accountActions"
@connect((store) => {
    return { ...store.account }
})

export default class ImportByDevice extends React.Component {

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
        this.walletType = 'trezor';
        this.dPath = '';
        this.generator = null;
    }

    connectDevice(walletType) {
        this.setDeviceState();
        switch (walletType) {
            case 'trezor': {
                let promise = getTrezorPublicKey();
                promise.then((result) => {
                    this.generateAddress(result);
                    this.dPath = result.dPath;
                })
                break;
            }
            case 'ledger': {
                connectLedger().then((eth) => {
                    getLedgerPublicKey(eth).then((result) => {
                        this.generateAddress(result);
                        this.dPath = result.dPath;
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                    console.log(err)
                });
                break;
            }
        }
        console.log(this.dPath);
        this.walletType = walletType;
    }

    generateAddress(data) {
        this.generator = new AddressGenerator(data);
        let addresses = [];
        let index = 0;
        for (index; index < 5; index++) {
            let address = {
                addressString: this.generator.getAddressString(index),
                index: index,
            };
            addresses.push(address);
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
                let address = {
                    addressString: this.generator.getAddressString(i),
                    index: i,
                };
                addresses.push(address);
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

    getAddress() {
        let formAddress = JSON.parse(this.refs.formAddress.address.value),
            data = {
                address: formAddress.addressString,
                type: this.walletType,
                path: this.dPath + '/' + formAddress.index,

            };

        this.props.dispatch(importNewAccount(data.address, data.type, data.path))
        this.closeModal()
        // setTimeout(() => { this.goToExchange() }, 3000)
    }
    goToExchange = () => {
        // window.location.href = "/exchange"
        // this.props.router.push('/exchange')
        this.props.dispatch(push('/exchange'));
    }
    render() {
        const currentList = this.state.currentAddresses.map((address, index) => {
            return (
                <li key={address.addressString}>
                    <label>
                        <input type="radio"
                            name="address"
                            value={JSON.stringify(address)}
                            defaultChecked={index == 0 ? true : false} />
                        {address.addressString}
                    </label>
                </li>
            )
        })

        return (
            <div>
                <div class="small-12 medium-6 column" style={{padding: 0}}>
                    <div class="column column-block">
                        <div class="importer trezor">
                            <a onClick={this.connectDevice.bind(this, 'trezor')}>
                                <img src="/assets/img/trezor.svg" />
                                <div class="description">Import from<br />trezor</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="small-12 medium-6 column" style={{padding: 0}}>
                    <div class="column column-block">
                        <div class="importer ledger">
                            <a onClick={this.connectDevice.bind(this, 'ledger')}>
                                <img src="/assets/img/ledger.svg" />
                                <div class="description">Import from<br />ledger wallet</div>
                            </a>
                        </div>
                    </div>
                </div>
                <SelectAddressModal
                    open={this.state.modalOpen}
                    onRequestClose={this.closeModal.bind(this)}
                    content={
                        <div className="popup">
                            <form ref="formAddress">
                                <ul>
                                    {currentList}
                                </ul>
                            </form>
                            <a onClick={() => this.preAddress()}>Pre address</a> |
                            <a onClick={() => this.moreAddress()}> More address</a> |
                            <a onClick={() => this.getAddress()}> Select address</a>
                        </div>
                    }
                />

            </div>
        )
    }
}
