import React from "react";
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import constants from "../../services/constants"

import AddressGenerator from "../../services/device/addressGenerator";
import { getTrezorPublicKey, connectLedger, getLedgerPublicKey } from "../../services/device/device";
import SelectAddressModal from "../CommonElements/SelectAddressModal";
import ImportByDeviceView from '../../components/ImportAccount/ImportByDeviceView'

import { importNewAccount, throwError } from "../../actions/accountActions"
import { toEther } from "../../utils/converter"
import Gixi from "gixi"

@connect((store) => {
	return {
		ethereumNode: store.connection.ethereum,
		account: store.account,
	}
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

		this.DPATH = [
			{ path: "m/44'/60'/0'/0", desc: 'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox', defaultType: 'trezor', active: 0 },
			{ path: "m/44'/60'/0'", desc: 'Ledger (ETH)', defaultType: 'ledger', active: 0 },
			{ path: "m/44'/61'/0'/0", desc: 'TREZOR (ETC)', active: 0 },
			{ path: "m/44'/60'/160720'/0'", desc: 'Ledger (ETC)', active: 0 },
			{ path: "m/0'/0'/0'", desc: 'SingularDTV', notSupport: true, active: 0 },
			{ path: "m/44'/1'/0'/0", desc: 'Network: Testnets', active: 0 },
			{ path: "m/44'/40'/0'/0", desc: 'Network: Expanse', notSupport: true, active: 0 },
			{ path: 0, desc: 'Your Custom Path', defaultP: "m/44'/60'/1'/0", active: 0 },
		]
	}

	setDeviceState() {
		this.addressIndex = 0;
		this.currentIndex = 0;
		this.walletType = 'trezor';
		this.dPath = '';
		this.generator = null;
	}

	connectDevice(walletType, path) {
		this.setDeviceState();
		switch (walletType) {
			case 'trezor': {
				let promise = getTrezorPublicKey(path);
				promise.then((result) => {
					this.generateAddress(result);
					this.dPath = result.dPath;
				}).catch((err) => {
					if (err.toString() == 'Error: Not a valid path.') {
						this.props.dispatch(throwError('This path not supported  by Trezor'))
					}
				})
				break;
			}
			case 'ledger': {
				console.log(this)
				connectLedger().then((eth) => {
					getLedgerPublicKey(eth, path).then((result) => {
						this.generateAddress(result);
						this.dPath = result.dPath;
					}).catch((err) => {
						switch (err) {
							case 'Invalid status 6801':
							case 'Invalid status 6a80':
							case 'Invalid status 6804':
								let msg = 'Check to make sure the right application is selected';
								this.props.dispatch(throwError(msg))
								break;
						}
						console.log(err)
					});
				}).catch((err) => {
					console.log(err)
				});
				break;
			}
		}
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
				balance: -1,
			};
			address.avatar = this.getRandomAvatar(address.addressString)
			addresses.push(address);
			this.updateBalance(address.addressString, index);
		}
		this.addressIndex = index;
		this.currentIndex = index;

		this.setState({
			addresses: addresses,
			currentAddresses: addresses
		})
		if (!this.state.modalOpen) this.openModal();
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
			j = i + 5,
			currentAddresses = [];
		if (this.addressIndex == this.currentIndex) {
			for (i; i < j; i++) {
				let address = {
					addressString: this.generator.getAddressString(i),
					index: i,
					balance: -1,
				};
				address.avatar = this.getRandomAvatar(address.addressString)
				addresses.push(address);
				currentAddresses.push(address);
				this.updateBalance(address.addressString, i);

			}
		}
		this.addressIndex = i;
		this.currentIndex += 5;

		this.setState({
			addresses: addresses,
			currentAddresses: addresses.slice(this.currentIndex - 5, this.currentIndex)
		})
	}

	getRandomAvatar(addressString) {
		return new Gixi(36, addressString).getImage();
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

	getAddress(data) {
		this.props.dispatch(importNewAccount(data.address, data.type, data.path, this.props.ethereumNode, data.avatar))
		this.closeModal()
	}
	goToExchange = () => {
		this.props.dispatch(push('/exchange'));
	}

	choosePath(path) {
		this.connectDevice(this.walletType, path);
	}

	getBalance(address) {
		return new Promise((resolve, reject) => {
			this.props.ethereumNode.getBalance(address, (balance) => {
				resolve(toEther(balance))
			})
		})
	}

	updateBalance(address, index) {
		this.getBalance(address)
			.then((result) => {
				let addresses = this.state.addresses;
				addresses[index].balance = result
				this.setState({
					currentList: addresses
				})

			})
	}

	render() {
		return (
			<ImportByDeviceView
				modalOpen={this.state.modalOpen}
				onRequestClose={this.closeModal.bind(this)}
				connectTrezor={() => this.connectDevice('trezor')}
				connectLedger={() => this.connectDevice('ledger')}
				getPreAddress={() => this.preAddress()}
				getMoreAddress={() => this.moreAddress()}
				dPath={this.DPATH}
				currentDPath={this.dPath}
				currentAddresses={this.state.currentAddresses}
				walletType={this.walletType}
				getAddress={this.getAddress.bind(this)}
				choosePath={this.choosePath.bind(this)}
			/>
		)
	}
}
