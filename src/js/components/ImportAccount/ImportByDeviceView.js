import React from "react";
import { SelectAddressModal } from "../ImportAccount";
import { roundingNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"

const ImportByDeviceView = (props) => {

    function choosePath(dpath) {
        let formPath = document.getElementById('formPath'),
            selectedPath = dpath;
        if (!dpath) {
            selectedPath = formPath.customPath.value;
        }
        props.choosePath(selectedPath, dpath);
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
        const addressLink = BLOCKCHAIN_INFO.ethScanUrl + 'address/';
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
                        <a class="link has-tip top explore" href={addressLink + address.addressString} target="_blank" title="View on Etherscan">
                            <span title={address.balance}>
                                {address.balance == '-1' ?
                                    <img src="/assets/img/waiting.svg" />
                                    : roundingNumber(address.balance)
                                } ETH
                            </span>
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
            let active = (props.currentDPath == dPath.path) ? 'active' : ''
            return (
                <div class="column" key={dPath.path}>
                    <input type="radio" name="path"
                        defaultValue={dPath.path}
                        disabled={disabledPath}
                    />
                    <label class={'address-path-stamp ' + active}
                        onClick={() => {
                            if (dPath.path && !disabledPath) choosePath(dPath.path)
                        }}
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
                                            <a class="submit pulse animated infinite"
                                                style={{ display: 'block' }}
                                                onClick={() => choosePath(dPath.path)}
                                            ></a>
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
                            <form id="formPath" onSubmit={(e) => e.preventDefault()}>
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
                                {props.translate("modal.select_address") || "Select the address you would like to interact with"}
                            </div>
                            <form id="formAddress">
                                <ul class="address-list animated fadeIn">
                                    {getCurrentList()}
                                </ul>
                            </form>
                            <div class="address-list-navigation animated fadeIn">
                                <a class={'previous ' + (props.isFirstList ? 'disabled' : '')} onClick={props.getPreAddress}>{props.translate("modal.previous_addresses") || "Previous Addresses"}</a>
                                <a class="next" onClick={props.getMoreAddress}>{props.translate("modal.more_addresses") || "More Addresses"}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return ([
        // <div class="small-6 medium-4 column" key="trezor">
        //     <div class="column column-block">
        //         <div class="importer trezor">
        //             <a onClick={() => props.showLoading('trezor')}>
        //                 <img src="/assets/img/trezor.svg" />
        //                 <div class="description">Import from<br />trezor</div>
        //             </a>
        //         </div>
        //     </div>
        // </div>,
        // <div class="small-6 medium-4 medium-offset-2 column" key="ledger">
        //     <div class="column column-block">
        //         <div class="importer ledger">
        //             <a onClick={() => props.showLoading('ledger')}>
        //                 <img src="/assets/img/ledger.svg" />
        //                 <div class="description">Import from<br />ledger wallet</div>
        //             </a>
        //         </div>
        //     </div>
        // </div>,
        <div class="column column-block" key='coldwallet'>{props.content}</div>,
        <SelectAddressModal key="modal"
            isOpen={props.modalOpen}
            onRequestClose={props.onRequestClose}
            content={getSelectAddressHtml()}
            translate={props.translate}
        />

    ])
}

export default ImportByDeviceView