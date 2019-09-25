import React from "react";
import { SelectAddressModal } from "../ImportAccount";
import { roundingNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
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
        props.analytics.callTrack("trackChoosePathColdWallet", selectedPath);
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
                <div className={"address-item"} key={address.addressString} onClick={() => getAddress(address)}>
                    <div className="address-item__address">
                        <a class="name text-lowercase">
                            <label class="mb-0">
                                <span class="hash">{address.addressString.slice(0, 12)}...{address.addressString.slice(-8)}</span>
                            </label>
                        </a>
                    </div>
                    <div class="address-item__import">
                        <a class="balance" title={address.balance}>
                            {address.balance == '-1' ?
                                <img src={require('../../../assets/img/waiting-white.svg')} />
                                : roundingNumber(address.balance)
                            } ETH
                        </a>
                        <a class="import">
                            {props.translate("import.import") || "Import"}
                            {/* <img src={require('../../../assets/img/import-account/arrow_right_orange.svg')}/> */}
                        </a>
                    </div>
                </div>
            )
        })
        return currentListHtml;
    }

    function getListPathHtml() {
      return (
        <PathSelector
          listItem = {props.dPath}
          choosePath = {choosePath}
          walletType = {props.walletType}
          currentDPath = {props.currentDPath}
          analytics={props.analytics}
        />
      )
    }

    function getSelectAddressHtml() {
        return (
            <div className={"import-modal import-modal__cold-wallet"}>
                <div class="import-modal__header cold-wallet">
                    <div className="import-modal__header--title">
                        {props.translate(`modal.select_${props.walletType}_address`) || 'Select address'}
                    </div>
                    <a class="x" onClick={props.onRequestClose}>&times;</a>
                    {/* <div className="top-wrapper">
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
                    </div> */}
                </div>
                <div class="import-modal__body">
                    <div class="cold-wallet__path">
                        <div class="cold-wallet__path--title">
                            {props.translate("modal.select_hd_path") || "Select HD derivation path"}
                        </div>
                        <div className="cold-wallet__path--choose-path">
                            {getListPathHtml()}
                        </div>
                    </div>
                    <div class="cold-wallet__address">
                        <div class="cold-wallet__address--title">
                            {props.translate("modal.select_address") || "Select the address you would like to interact with"}
                        </div>
                        <div class="address-list animated fadeIn">
                            {getCurrentList()}
                        </div>
                    </div>
                </div>
                <div className={"import-modal__footer import-modal__footer--cold-wallet"}>
                    <div class={'address-button address-button-previous ' + (props.isFirstList ? 'disabled' : '')} onClick={props.getPreAddress}>
                        {/* <img src={require('../../../assets/img/import-account/arrows_left_icon.svg')} /> */}
                        {/* <span>{props.translate("modal.previous_addresses") || "Previous Addresses"}</span> */}
                        <div className={"address-arrow address-arrow-left"}></div>
                    </div>
                    <div class="address-button address-button-next" onClick={props.getMoreAddress}>
                        {/* <span>{props.translate("modal.more_addresses") || "More Addresses"}</span> */}
                        {/* <img src={require('../../../assets/img/import-account/arrows_right_icon.svg')} /> */}
                        <div className={"address-arrow address-arrow-right"}></div>
                    </div>
                </div>
            </div>
        )
    }

    return ([
        <div key='coldwallet'>{props.content}</div>,
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
