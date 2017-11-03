import React from "react";
import constants from "../../services/constants"
import SelectAddressModal from "../../containers/CommonElements/SelectAddressModal";

export default class ImportByDeviceView extends React.Component {

    choosePath() {
        let formPath = this.refs.formPath,
            path = formPath.path.value;

        path = (path != 0) ? path : formPath.customPath.value;
        this.props.choosePath(path);
    }

    getAddress() {
		let formAddress = JSON.parse(this.refs.formAddress.address.value),
			data = {
				address: formAddress.addressString,
				type: this.props.walletType,
				path: this.props.currentDPath + '/' + formAddress.index,
				avatar: formAddress.avatar

			};

        this.props.getAddress(data);
	}

    getCurrentList() {
        const addressLink = constants.KOVAN_ETH_URL + 'address/';
        let currentListHtml = this.props.currentAddresses.map((address, index) => {
            return (
                <li key={address.addressString}>
                    <a class="name">
                        <label for={'address-' + address.addressString} style={{ marginBottom: 0, cursor: 'pointer', textTransform: 'lowercase' }}>
                            <img src={address.avatar} />
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
                        <a class="link has-tip top explore" href={addressLink + address.addressString} target="_blank" title="View on Etherscan">		{address.balance == '-1' ?
                            <img src="/assets/img/waiting.svg" />
                            : address.balance
                        } ETH
						</a>
                    </div>
                </li>
            )
        })
        return currentListHtml;
    }

    getListPathHtml() {
        let listPath = this.props.dPath.map((dPath, index) => {
            let disabledPath = (this.props.walletType == 'ledger' && dPath.notSupport) ? true : false;
            let defaultChecked = (dPath.defaultType == this.props.walletType) ? true : false
            return (
                <div class="column" key={dPath.path}>
                    <input id={'path-' + index} type="radio" name="path"
                        defaultValue={dPath.path}
                        defaultChecked={defaultChecked}
                        onClick={() => this.choosePath()}
                        disabled={disabledPath}
                    />
                    <label class="address-path-stamp"
                        for={'path-' + index}
                        style={disabledPath ? { opacity: .5 } : {}}>
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
                                            <a class="submit pulse animated infinite" style={{ display: 'block' }}></a>
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
                                <a class="previous" onClick={this.props.getPreAddress}>Previous Addresses</a>
                                <a class="next" onClick={this.props.getMoreAddress}>More Addresses</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {

        return (
            <div>
                <div class="small-12 medium-6 column" style={{ padding: 0 }}>
                    <div class="column column-block">
                        <div class="importer trezor">
                            <a onClick={this.props.connectTrezor}>
                                <img src="/assets/img/trezor.svg" />
                                <div class="description">Import from<br />trezor</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="small-12 medium-6 column" style={{ padding: 0 }}>
                    <div class="column column-block">
                        <div class="importer ledger">
                            <a onClick={this.props.connectLedger}>
                                <img src="/assets/img/ledger.svg" />
                                <div class="description">Import from<br />ledger wallet</div>
                            </a>
                        </div>
                    </div>
                </div>
                <SelectAddressModal
                    open={this.props.modalOpen}
                    onRequestClose={this.props.onRequestClose}
                    content={this.getSelectAddressHtml()}
                />

            </div>
        )
    }
}
