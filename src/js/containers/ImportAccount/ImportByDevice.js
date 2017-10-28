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
			{ path: 0, desc: 'Your Custom Path', defaultP: "m/44'/60'/1'/0" },
			{ path: "m/44'/1'/0'/0", desc: 'Network: Testnets' },
			{ path: "m/44'/40'/0'/0", desc: 'Network: Expanse' },
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

		this.props.dispatch(importNewAccount(data.address, data.type, data.path))
		this.closeModal()
		// setTimeout(() => { this.goToExchange() }, 3000)
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
					<label style={{ marginBottom: 0 }}>
						<input type="radio"
							name="address"
							value={JSON.stringify(address)}
							defaultChecked={index == 0 ? true : false}
						/>
						<a href={addressLink + address.addressString} target="_blank">{address.addressString} </a>
						 - <span> {address.balance} ETH</span>
						<br />
					</label>
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

	render() {
		let listPath = this.DPATH.map((dPath, index) => {
			return (
				<label style={{ width: 200, float: 'left' }} key={dPath.path}>
					<input type="radio" name="path"
						defaultValue={dPath.path}
						defaultChecked={(dPath.defaultType == this.walletType) ? true : false}
					/>
					{
						dPath.path ? 
						(
							<span>
								{dPath.path}
								<br />
								{dPath.desc}
							</span>
						) : (
							<span>
								{dPath.desc}
								<input type="text" name="customPath"
									defaultValue={dPath.defaultP}
								/>
							</span>
						)
					}
				</label>
			)
		})
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
					content={
						<div className="popup">
							<form ref="formPath">
								{listPath}
								<div style={{ clear: 'both' }}></div>
							</form>

							<button class="button expand" onClick={() => this.choosePath()}>Change path</button>
							<br/>

							<form ref="formAddress">
								<ul>
									{this.getCurrentList()}
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
