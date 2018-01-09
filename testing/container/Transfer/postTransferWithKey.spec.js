import store from '../store';
import React from 'react';
import PostTransferWithKey from '../../../src/js/containers/Transfer/PostTransferWithKey';
import PostTransfer from '../../../src/js/containers/Transfer/PostTransfer';
import { KeyStore, Trezor, Ledger, PrivateKey, Metamask } from "../../../src/js/services/keys"

import { shallow, mount } from 'enzyme';

describe('Test key import', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('If key is keystore', () => {
        store.getState().account.account.type = 'keystore';
        const component = shallow(
            <PostTransferWithKey store={store} />
        ).dive();

        let keyService = component.find(PostTransfer).props().keyService
        expect(keyService).toBeInstanceOf(KeyStore);
    })

    it('If key is trezor', () => {
        store.getState().account.account.type = 'trezor';
        const component = shallow(
            <PostTransferWithKey store={store} />
        ).dive();

        let keyService = component.find(PostTransfer).props().keyService
        expect(keyService).toBeInstanceOf(Trezor);
    })

    it('If key is ledger', () => {
        store.getState().account.account.type = 'ledger';
        const component = shallow(
            <PostTransferWithKey store={store} />
        ).dive();

        let keyService = component.find(PostTransfer).props().keyService
        expect(keyService).toBeInstanceOf(Ledger);
    })

    it('If key is privateKey', () => {
        store.getState().account.account.type = 'privateKey';
        const component = shallow(
            <PostTransferWithKey store={store} />
        ).dive();

        let keyService = component.find(PostTransfer).props().keyService
        expect(keyService).toBeInstanceOf(PrivateKey);
    })

    it('If key is metamask', () => {
        store.getState().account.account.type = 'metamask';
        const component = shallow(
            <PostTransferWithKey store={store} />
        ).dive();

        let keyService = component.find(PostTransfer).props().keyService
        expect(keyService).toBeInstanceOf(Metamask);
    })
})