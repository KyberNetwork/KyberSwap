import React from "react";
import { SelectAddressModal } from "../ImportAccount";
import { roundingNumber } from "../../utils/converter"
import PathSelector from "../../containers/CommonElements/PathSelector";

const ImportByDeviceView = (props) => {

  function choosePath(dpath) {
    let inputPath = document.getElementById('form-input-custom-path');
    let selectedPath = dpath.value;

    if (!selectedPath) {
      selectedPath = inputPath.value;
      dpath = { value: selectedPath, desc: 'Your Custom Path' };
    }

    props.choosePath(dpath);
    props.analytics.callTrack("trackChoosePathColdWallet", selectedPath);
  }

  function getAddress(formAddress) {
    let data = {
      address: formAddress.addressString,
      type: props.walletType,
      path: props.currentDPath.value + '/' + formAddress.index,
    };

    if (props.currentDPath.bip44) {
      data.path = `${props.currentDPath.value}/${formAddress.index}'/0/0`;
    }

    props.getAddress(data);
  }

  function getCurrentList() {
    let currentListHtml = props.currentAddresses.map((address) => {
      return (
        <div className={"address-item"} key={address.addressString}>
          <div className="address-item__address">
            <div class="name text-lowercase theme__text-6">
              <label class="mb-0">
                <span class="hash">{address.addressString.slice(0, 12)}...{address.addressString.slice(-8)}</span>
              </label>
            </div>
          </div>
          <div class="address-item__import">
            <div class="balance theme__text-6 common__flexbox-normal" title={address.balance}>
              {address.balance == '-1' ?
                <img src={require(`../../../assets/img/${props.theme === 'dark' ? 'waiting-black' : 'waiting-white'}.svg`)}/>
                : roundingNumber(address.balance)
              } ETH
            </div>
            <div class="import" onClick={() => getAddress(address)}>
              {props.translate("import.import") || "Import"}
            </div>
          </div>
        </div>
      )
    })
    return currentListHtml;
  }

  function getListPathHtml() {
    return (
      <PathSelector
        listItem={props.allDPaths}
        choosePath={choosePath}
        walletType={props.walletType}
        currentDPath={props.currentDPath}
        analytics={props.analytics}
      />
    )
  }

  function getSelectAddressHtml() {
    return (
      <div className={"import-modal"}>
        <div class="import-modal__header cold-wallet">
          <div className="import-modal__header--title">
            {props.translate(`modal.select_${props.walletType}_address`) || 'Select address'}
          </div>
          <div class="x" onClick={props.onRequestClose}>&times;</div>
        </div>
        <div class="import-modal__body">
          <div class="cold-wallet__path">
            <div class="cold-wallet__path--title">
              {props.translate("modal.select_hd_path") || "Select HD derivation path"}
            </div>
            <div className="cold-wallet__path--choose-path theme__background-44">
              {getListPathHtml()}
            </div>
          </div>

          {props.isLoading && (
            <div className="text-center">
              <img src={require(`../../../assets/img/${props.theme === 'dark' ? 'waiting-black' : 'waiting-white'}.svg`)}/>
            </div>
          )}

          {!props.isLoading && (
            <div className="cold-wallet__address theme__text-6">
              <div className="cold-wallet__address--title">
                {props.translate("modal.select_address") || "Select the address you would like to interact with"}
              </div>
              <div className="address-list animated fadeIn">
                {getCurrentList()}
              </div>
            </div>
          )}
        </div>
        <div className={"import-modal__footer import-modal__footer--cold-wallet theme__background-2"}>
          <div className={'address-button address-button-previous ' + (props.isFirstList ? 'disabled' : '')}
               onClick={props.getPreAddress}>
            <div className={"address-arrow address-arrow-left theme__arrow-icon"}/>
          </div>
          <div className="address-button address-button-next" onClick={props.getMoreAddress}>
            <div className={"address-arrow address-arrow-right theme__arrow-icon"}/>
          </div>
        </div>
      </div>
    )
  }

  return ([
    <div key='coldwallet'>{props.content}</div>,
    <SelectAddressModal
      key="modal"
      isOpen={props.modalOpen}
      onRequestClose={props.onRequestClose}
      content={getSelectAddressHtml()}
      translate={props.translate}
      walletType={props.walletType}
    />
  ])
}

export default ImportByDeviceView
