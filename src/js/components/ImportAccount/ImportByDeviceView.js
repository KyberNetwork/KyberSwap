import React from "react";
import constants from "../../services/constants"
import { SelectAddressModal } from "../ImportAccount";

const ImportByDeviceView = (props) => {

    function choosePath() {
        let formPath = document.getElementById('formPath'),
            path = formPath.path.value;

        path = (path != 0) ? path : formPath.customPath.value;
        props.choosePath(path);
    }

    function getAddress() {
        let formAddress = JSON.parse(document.getElementById('formAddress').address.value),
            data = {
                address: formAddress.addressString,
                type: props.walletType,
                path: props.currentDPath + '/' + formAddress.index,
                avatar: formAddress.avatar

            };

        props.getAddress(data);
    }

    function getCurrentList() {
        const addressLink = constants.KOVAN_ETH_URL + 'address/';
        let currentListHtml = props.currentAddresses.map((address, index) => {
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
                            onClick={() => getAddress()}
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

    function getListPathHtml() {
        let listPath = props.dPath.map((dPath, index) => {
            let disabledPath = (props.walletType == 'ledger' && dPath.notSupport) ? true : false;
            let defaultChecked = (dPath.defaultType == props.walletType) ? true : false
            return (
                <div class="column" key={dPath.path}>
                    <input id={'path-' + index} type="radio" name="path"
                        defaultValue={dPath.path}
                        defaultChecked={defaultChecked}
                        onClick={() => choosePath()}
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

    function getSelectAddressHtml() {
        return (
            <div>
                <div class="content">
                    <div class="row">
                        <div class="column">
                            <form id="formPath">
                                <div class="row small-up-2 medium-up-3 large-up-3 address-paths gutter-15">
                                    {getListPathHtml()}
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
                            <form id="formAddress">
                                <ul class="address-list animated fadeIn">
                                    {getCurrentList()}
                                </ul>
                            </form>
                            <div class="address-list-navigation animated fadeIn">
                                <a class="previous" onClick={props.getPreAddress}>Previous Addresses</a>
                                <a class="next" onClick={props.getMoreAddress}>More Addresses</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div class="small-12 medium-6 column" style={{ padding: 0 }}>
                <div class="column column-block">
                    <div class="importer trezor">
                        <a onClick={props.connectTrezor}>
                            <img src="/assets/img/trezor.svg" />
                            <div class="description">Import from<br />trezor</div>
                        </a>
                    </div>
                </div>
            </div>
            <div class="small-12 medium-6 column" style={{ padding: 0 }}>
                <div class="column column-block">
                    <div class="importer ledger">
                        <a onClick={props.connectLedger}>
                            <img src="/assets/img/ledger.svg" />
                            <div class="description">Import from<br />ledger wallet</div>
                        </a>
                    </div>
                </div>
            </div>
            <SelectAddressModal
                isOpen={props.modalOpen}
                onRequestClose={props.onRequestClose}
                content={getSelectAddressHtml()}
            />

        </div>
    )
}

export default ImportByDeviceView