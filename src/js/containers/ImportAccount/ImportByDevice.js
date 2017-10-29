import React from "react";
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import constants from "../../services/constants"

import AddressGenerator from "../../services/device/addressGenerator";
import { getTrezorPublicKey, connectLedger, getLedgerPublicKey } from "../../services/device/device";
import SelectAddressModal from "../CommonElements/SelectAddressModal";

import { importNewAccount } from "../../actions/accountActions"
import { toEther } from "../../utils/converter"

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
			{ path: "m/44'/60'/0'/0", desc: 'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox', defaultType: 'trezor' },
			{ path: "m/44'/60'/0'", desc: 'Ledger (ETH)', defaultType: 'ledger' },
			{ path: "m/44'/61'/0'/0", desc: 'TREZOR (ETC)' },
			{ path: "m/44'/60'/160720'/0'", desc: 'Ledger (ETC)' },
			{ path: "m/0'/0'/0'", desc: 'SingularDTV' },
			{ path: "m/44'/1'/0'/0", desc: 'Network: Testnets' },
			{ path: "m/44'/40'/0'/0", desc: 'Network: Expanse' },
			{ path: 0, desc: 'Your Custom Path', defaultP: "m/44'/60'/1'/0" },
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
				})
				break;
			}
			case 'ledger': {

				connectLedger().then((eth) => {
					getLedgerPublicKey(eth, path).then((result) => {
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
				balance: 'loading...',
			};
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
		console.log('before ', this.currentIndex, this.addressIndex);
		console.log('before ', this.state);
		if (this.addressIndex == this.currentIndex) {
			for (i; i < j; i++) {
				let address = {
					addressString: this.generator.getAddressString(i),
					index: i,
					balance: 'loading...',
				};
				addresses.push(address);
				currentAddresses.push(address);
				this.updateBalance(address.addressString, i);

			}
		}
		this.addressIndex = i;
		this.currentIndex += 5;
		console.log('after ', this.currentIndex, this.addressIndex);
		console.log('after ', this.state);

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

		this.props.dispatch(importNewAccount(data.address, data.type, data.path, this.props.ethereumNode))
		this.closeModal()
	}
	goToExchange = () => {
		this.props.dispatch(push('/exchange'));
	}

	choosePath = () => {
		let formPath = this.refs.formPath,
			path = formPath.path.value;

		path = (path != 0) ? path : formPath.customPath.value;
		this.connectDevice(this.walletType, path);
	}

	getBalance(address) {
		return new Promise((resolve, reject) => {
			this.props.ethereumNode.getBalance(address, (balance) => {
				resolve(toEther(balance))
			})
		})
	}

	getCurrentList() {
		const addressLink = constants.KOVAN_ETH_URL + 'address/';
		let currentListHtml = this.state.currentAddresses.map((address, index) => {
			return (
				<li key={address.addressString}>
					<a class="name">
						<label for={'address-' + address.addressString} style={{ marginBottom: 0, cursor: 'pointer' }}>
							<img src="/assets/img/address.png" />
							<span class="hash">{address.addressString}</span>
						</label>
						<input type="radio" id={'address-' + address.addressString}
							name="address"
							value={JSON.stringify(address)}
							onClick={() => this.getAddress()}
							style={{ display: 'none' }}
						/>
					</a>
					<div class="info">
						<a class="link has-tip top explore" data-tooltip="" href={addressLink + address.addressString} target="_blank" title="View on Etherscan">{address.balance} ETH
						</a>
					</div>
				</li>
			)
		})
		return currentListHtml;
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

	getSelectAddressHtml() {
		return (
			<div>
				<div class="content">
					<div class="row">
						<div class="column">
							<form ref="formPath">
								<div class="row small-up-2 medium-up-3 large-up-3 address-paths gutter-15">
									{this.getListPathHtml()}
								</div>
							</form>
						</div>
					</div>
				</div>
				<div class="content white">
					<div class="row">
						<div class="column">
							<div class="block-title">
								Select the address you would like to interact with
								<img class="loading" src="/assets/img/waiting.svg" />
							</div>
							<form ref="formAddress">
								<ul class="address-list animated fadeIn">
									{this.getCurrentList()}
								</ul>
							</form>
							<div class="address-list-navigation animated fadeIn">
								<a class="previous" onClick={() => this.preAddress()}>Previous Addresses</a>
								<a class="next" onClick={() => this.moreAddress()}>More Addresses</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	getListPathHtml() {
		let listPath = this.DPATH.map((dPath, index) => {
			return (
				<div class="column" key={dPath.path}>
					<input id={'path-' + index} type="radio" name="path"
						defaultValue={dPath.path}
						defaultChecked={(dPath.defaultType == this.walletType) ? true : false}
						onClick={() => this.choosePath()}
					/>
					<label class="address-path-stamp" for={'path-' + index}>
						{
							dPath.path ? (
								<div>
									<div class="name">{dPath.path}</div>
									<div class="note">{dPath.desc}</div>
								</div>
							) : (
									<div>
										<div class="name">{dPath.desc}</div>
										<div class="address-path-input">
											<input type="text" name="customPath" defaultValue={dPath.defaultP} />
											<a class="submit pulse animated infinite" onClick={() => this.choosePath()} style={{ display: 'block' }}></a>
										</div>
									</div>
								)
						}
					</label>
				</div>
			)
		})
		return listPath;
	}

	render() {
		return (
			<div>
				<div class="small-12 medium-6 column" style={{ padding: 0 }}>
					<div class="column column-block">
						<div class="importer trezor">
							<a onClick={() => this.connectDevice('trezor')}>
								<img src="/assets/img/trezor.svg" />
								<div class="description">Import from<br />trezor</div>
							</a>
						</div>
					</div>
				</div>
				<div class="small-12 medium-6 column" style={{ padding: 0 }}>
					<div class="column column-block">
						<div class="importer ledger">
							<a onClick={() => this.connectDevice('ledger')}>
								<img src="/assets/img/ledger.svg" />
								<div class="description">Import from<br />ledger wallet</div>
							</a>
						</div>
					</div>
				</div>
				<SelectAddressModal
					open={this.state.modalOpen}
					onRequestClose={this.closeModal.bind(this)}
					content={this.getSelectAddressHtml()}
				/>

			</div>
		)
	}
}
