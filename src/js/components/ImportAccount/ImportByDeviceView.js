import React from "react";
import { SelectAddressModal } from "../ImportAccount";
import { roundingNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown'
import PathSelector from "../../containers/CommonElements/PathSelector";

const ImportByDeviceView = (props) => {

    function choosePath(dpath) {
        let inputPath = document.getElementById('form-input-custom-path'),
            selectedPath = dpath;
        if (!dpath) {
            console.log("inputpath: ", inputPath.value)
            selectedPath = inputPath.value;
        }
        props.choosePath(selectedPath, dpath);
    }

    function getAddress(formAddress) {
        let data = {
                address: formAddress.addressString,
                type: props.walletType,
                path: props.currentDPath + '/' + formAddress.index,
            };

        props.getAddress(data);
    }

    function getCurrentList() {
        const addressLink = BLOCKCHAIN_INFO.ethScanUrl + 'address/';
        let currentListHtml = props.currentAddresses.map((address, index) => {
            return (
                <li key={address.addressString} onClick={() => getAddress(address)}>
                    <div className="grid-x">
                        <div className="cell medium-6 small-12">
                            <a class="name text-lowercase">
                                <label class="mb-0">
                                    <span class="hash">{address.addressString}</span>
                                </label>
                            </a>
                        </div>
                        <div class="info cell medium-6 small-12">
                            <a class="link has-tip top explore" title={address.balance}>
                                {address.balance == '-1' ?
                                    <img src={require('../../../assets/img/waiting-white.svg')} />
                                    : roundingNumber(address.balance)
                                } ETH
                            </a>
                            <a class="import">
                                {props.translate("import.import") || "Import"}
                                <img src={require('../../../assets/img/import-account/arrow_right_orange.svg')}/>
                            </a>
                        </div>
                    </div>
                </li>
            )
        })
        return currentListHtml;
    }

    function getListPathHtml() {
        return (<PathSelector
            listItem = {props.dPath}
            choosePath = {choosePath}
            walletType = {props.walletType}
            currentDPath = {props.currentDPath}
        />)
    }

    function getSelectAddressHtml() {
        return (
            <div>
                <div class="content">
                    <div className="top-wrapper">
                        <div class="title">{props.translate(`modal.select_${props.walletType}_address`) || 'Select address'}</div><a class="x" onClick={props.onRequestClose}>&times;</a>
                        <div class="row">
                            <div class="column">
                                <div class="block-title">
                                    {props.translate("modal.select_hd_path") || "Select HD derivation path"}
                                </div>
                                <div className="block-choose-path">
                                    {getListPathHtml()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content white">
                    <div class="row">
                        <div class="column">
                            <div class="block-title">
                                {props.translate("modal.select_address") || "Select the address you would like to interact with"}
                            </div>
                            <ul class="address-list animated fadeIn">
                                {getCurrentList()}
                            </ul>
                            <div class="address-list-navigation animated fadeIn">
                                <a class={'previous ' + (props.isFirstList ? 'disabled' : '')} onClick={props.getPreAddress}>
                                    <img src={require('../../../assets/img/import-account/arrows_left_icon.svg')} />
                                    <span>{props.translate("modal.previous_addresses") || "Previous Addresses"}</span>
                                </a>
                                <a class="next" onClick={props.getMoreAddress}>
                                    <span>{props.translate("modal.more_addresses") || "More Addresses"}</span>
                                    <img src={require('../../../assets/img/import-account/arrows_right_icon.svg')} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return ([
        <div class="column column-block" key='coldwallet'>{props.content}</div>,
        <SelectAddressModal key="modal"
            isOpen={props.modalOpen}
            onRequestClose={props.onRequestClose}
            content={getSelectAddressHtml()}
            translate={props.translate}
            walletType={props.walletType}
        />

    ])
}

export default ImportByDeviceView