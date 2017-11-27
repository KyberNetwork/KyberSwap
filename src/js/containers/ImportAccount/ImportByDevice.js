import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux'
import constants from "../../services/constants"
import { getRandomAvatar } from "../../utils/keys"

import AddressGenerator from "../../services/device/addressGenerator";
import { getTrezorPublicKey, connectLedger, getLedgerPublicKey } from "../../services/device/device";
import { ImportByDeviceView } from "../../components/ImportAccount"

import { importNewAccount, importLoading, closeImportLoading, throwError } from "../../actions/accountActions"
import { toEther } from "../../utils/converter"

@connect((store) => {
	var tokens = store.tokens.tokens
	var supportTokens = []
	Object.keys(tokens).forEach((key) => {
		supportTokens.push(tokens[key])
	})
	return {
		ethereumNode: store.connection.ethereum,
		account: store.account,
		tokens: supportTokens
	}
})


export default class ImportByDevice extends React.Component {
	constructor() {
		super();
		this.state = {
			addresses: [],
			currentAddresses: [],
			modalOpen: false,
			isFirstList: true,
		}
		this.setDeviceState();

		this.DPATH = [
			{ path: "m/44'/60'/0'/0", desc: 'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox', defaultType: 'trezor' },
			{ path: "m/44'/60'/0'", desc: 'Ledger (ETH)', defaultType: 'ledger' },
			{ path: "m/44'/61'/0'/0", desc: 'TREZOR (ETC)' },
			{ path: "m/44'/60'/160720'/0'", desc: 'Ledger (ETC)' },
			{ path: "m/0'/0'/0'", desc: 'SingularDTV', notSupport: true },
			{ path: "m/44'/1'/0'/0", desc: 'Network: Testnets' },
			{ path: "m/44'/40'/0'/0", desc: 'Network: Expanse', notSupport: true },
			{ path: 0, desc: 'Your Custom Path', defaultP: "m/44'/60'/1'/0", custom: false },
		]
	}

	setDeviceState() {
		this.addressIndex = 0;
		this.currentIndex = 0;
		this.walletType = 'trezor';
		this.generator = null;
	}

	updateBalance() {
		this.interval = setInterval(() => {
			console.log(this.state.addresses)
			this.state.addresses.forEach((address, index) => {
				this.addBalance(address.addressString, index);
			})
		}, 10000)
	}

	connectDevice(walletType, selectedPath, dpath) {
		this.setDeviceState();
		switch (walletType) {
			case 'trezor': {
				let promise = getTrezorPublicKey(selectedPath);
				promise.then((result) => {
					this.dPath = (dpath != 0) ? result.dPath : dpath;
					this.generateAddress(result);
					this.props.dispatch(closeImportLoading());
				}).catch((err) => {
					if (err.toString() == 'Error: Not a valid path.') {
						this.props.dispatch(throwError('This path not supported by Trezor'))
					}
					this.props.dispatch(closeImportLoading());
					this.props.dispatch(throwError('Cannot connect to ' + this.walletType))
				})
				break;
			}
			case 'ledger': {
				connectLedger().then((eth) => {
					getLedgerPublicKey(eth, selectedPath).then((result) => {
						this.dPath = (dpath != 0) ? result.dPath : dpath;
						this.generateAddress(result);
						this.props.dispatch(closeImportLoading());
					}).catch((err) => {
						switch (err) {
							case 'Invalid status 6801':
							case 'Invalid status 6a80':
							case 'Invalid status 6804':
								let msg = 'Check to make sure the right application is selected';
								this.props.dispatch(throwError(msg))
								break;
							default:
								this.props.dispatch(throwError('Cannot connect to ' + this.walletType))
						}
						this.props.dispatch(closeImportLoading());
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
			address.avatar = getRandomAvatar(address.addressString)
			addresses.push(address);
			this.addBalance(address.addressString, index);
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
		this.updateBalance();
	}

	closeModal() {
		this.setState({
			modalOpen: false,
		})
		clearInterval(this.interval);
	}

	moreAddress() {
		let addresses = this.state.addresses,
			i = this.addressIndex,
			j = i + 5,
			currentAddresses = [];
		if (this.generator) {
			if (this.addressIndex == this.currentIndex) {
				for (i; i < j; i++) {
					let address = {
						addressString: this.generator.getAddressString(i),
						index: i,
						balance: -1,
					};
					address.avatar = getRandomAvatar(address.addressString)
					addresses.push(address);
					currentAddresses.push(address);
					this.addBalance(address.addressString, i);

				}
			}
			this.addressIndex = i;
			this.currentIndex += 5;
			this.setState({
				addresses: addresses,
				currentAddresses: addresses.slice(this.currentIndex - 5, this.currentIndex)
			})
			if (this.state.isFirstList) {
				this.setState({
					isFirstList: false
				})
			}
		} else {
			this.props.dispatch(throwError('Cannot connect to ' + this.walletType))
		}
	}

	preAddress() {
		let addresses = this.state.addresses;
		if (this.currentIndex > 5) {
			this.currentIndex -= 5;
			this.setState({
				currentAddresses: addresses.slice(this.currentIndex - 5, this.currentIndex),
			})
		}
		if (this.currentIndex <= 5) {
			this.setState({
				isFirstList: true
			})
		}
	}

	getAddress(data) {
		this.props.dispatch(importNewAccount(data.address, data.type, data.path, this.props.ethereumNode, data.avatar, this.props.tokens))
		this.closeModal()
	}

	choosePath(selectedPath, dpath) {
		this.props.dispatch(importLoading());
		this.connectDevice(this.walletType, selectedPath, dpath);
	}

	getBalance(address) {
		return new Promise((resolve, reject) => {
			this.props.ethereumNode.call("getBalance")(address).then((balance) => {
				resolve(toEther(balance))
			})
		})
	}

	addBalance(address, index) {
		this.getBalance(address)
			.then((result) => {
				let addresses = this.state.addresses;
				addresses[index].balance = result
				this.setState({
					currentList: addresses
				})
			})
	}

	showLoading(walletType) {
		this.props.dispatch(importLoading());
		this.connectDevice(walletType);
	}

	render() {
		return (
			<ImportByDeviceView
				modalOpen={this.state.modalOpen}
				isFirstList={this.state.isFirstList}
				onRequestClose={this.closeModal.bind(this)}
				getPreAddress={() => this.preAddress()}
				getMoreAddress={() => this.moreAddress()}
				dPath={this.DPATH}
				currentDPath={this.dPath}
				currentAddresses={this.state.currentAddresses}
				walletType={this.walletType}
				getAddress={this.getAddress.bind(this)}
				choosePath={this.choosePath.bind(this)}
				showLoading={this.showLoading.bind(this)}
			/>
		)
	}
}
