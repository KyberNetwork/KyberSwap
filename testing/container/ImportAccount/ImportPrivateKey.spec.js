import store from '../store';
import React from 'react';
import ImportByPrivateKey from '../../../src/js/containers/ImportAccount/ImportByPrivateKey';
import ImportByPKeyView from '../../../src/js/components/ImportAccount/ImportByPKeyView';
import Modal from '../../../src/js/components/CommonElement/MyModal';
import { getTranslate } from 'react-localize-redux';

import { shallow, mount } from 'enzyme';
import BigNumber from "bignumber.js";

describe('ImportByPrivateKey', () => {
    it('render 1 <ImportByPrivateKey /> component', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        expect(component.length).toBe(1)
    })
})

describe('Open close modal', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Open modal', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        const importByPKeyView = shallow(
            <ImportByPKeyView
                modalOpen={component.instance().openModal.bind(component.instance())}
                translate={getTranslate(store.getState().locale)}
            />
        );
        importByPKeyView.find('#importPKey').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.OPEN_PKEY_MODAL",
        });
    })

    it('Close modal', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        const importByPKeyView = shallow(
            <ImportByPKeyView
                onRequestClose={component.instance().closeModal.bind(component.instance())}
                translate={getTranslate(store.getState().locale)}
            />
        );
        importByPKeyView.find(Modal).dive().find('.x').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.CLOSE_PKEY_MODAL",
        });
    })
})

describe('Input passphare change', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Input passphare change', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        const importByPKeyView = shallow(
            <ImportByPKeyView
                onChange={component.instance().inputChange.bind(component.instance())}
                translate={getTranslate(store.getState().locale)}
            />
        );
        importByPKeyView.find(Modal).dive().find('#private_key').simulate('change', {
            target: { value: '0ffffffffffff' }
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.PKEY_CHANGE",
            payload: "0ffffffffffff"
        });
    })
})

describe('Import PrivateKey', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Import PrivateKey, invalid key', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        let pkey = 'This is invalid private key';
        component.instance().importPrivateKey(pkey);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.PKEY_ERROR",
            payload: "Missing localized key: error.invalid_private_key for language: active"
        });
    })

    it('Import PrivateKey, valid key', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        let pkey = '9e9b206620bf487df5aaa65ba28baf446fc9d9f67e1aa7506c56a54af9c849c5';
        component.instance().importPrivateKey(pkey);
        console.log(expect(store.dispatch).toHaveBeenCalledWith())
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.IMPORT_NEW_ACCOUNT_PENDING",
            payload: {
                "address": "0x95b4de7fb8800aab804a23d4185230949b503380",
                "ethereum": store.getState().connection.ethereum,
                "keystring": "9e9b206620bf487df5aaa65ba28baf446fc9d9f67e1aa7506c56a54af9c849c5",
                "metamask": null, 
                "tokens": [
                    {
                        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", 
                        "balance": new BigNumber(Math.pow(10, 19)), 
                        "decimal": 18, "icon": "/assets/img/tokens/eth.svg", "name": "Ethereum", "symbol": "ETH"},
                    {
                        "address": "0x1795b4560491c941c0635451f07332effe3ee7b3", 
                        "balance": new BigNumber(Math.pow(10, 18)), 
                        "decimal": 9, "icon": "/assets/img/tokens/omg.svg", "name": "OmiseGO","symbol": "OMG"
                    }
                ], 
                "type": "privateKey"
            }
        });
    })
})