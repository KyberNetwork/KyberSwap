import store from '../store';
import React from 'react';
import PostExchangeWithKey from '../../../src/js/containers/Exchange/PostExchangeWithKey';
import PostExchange from '../../../src/js/containers/Exchange/PostExchange';
import { KeyStore, Trezor, Ledger, PrivateKey, Metamask } from "../../../src/js/services/keys"

import { shallow, mount } from 'enzyme';

describe('Test key import', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('If key is keystore', () => {
        store.getState().account.account.type = 'keystore';
        const component = shallow(
            <PostExchangeWithKey store={store} />
        ).dive();

        let keyService = component.find(PostExchange).props().keyService
        expect(keyService).toBeInstanceOf(KeyStore);
    })

    it('If key is trezor', () => {
        store.getState().account.account.type = 'trezor';
        const component = shallow(
            <PostExchangeWithKey store={store} />
        ).dive();

        let keyService = component.find(PostExchange).props().keyService
        expect(keyService).toBeInstanceOf(Trezor);
    })

    it('If key is ledger', () => {
        store.getState().account.account.type = 'ledger';
        const component = shallow(
            <PostExchangeWithKey store={store} />
        ).dive();

        let keyService = component.find(PostExchange).props().keyService
        expect(keyService).toBeInstanceOf(Ledger);
    })

    it('If key is privateKey', () => {
        store.getState().account.account.type = 'privateKey';
        const component = shallow(
            <PostExchangeWithKey store={store} />
        ).dive();

        let keyService = component.find(PostExchange).props().keyService
        expect(keyService).toBeInstanceOf(PrivateKey);
    })

    it('If key is metamask', () => {
        store.getState().account.account.type = 'metamask';
        const component = shallow(
            <PostExchangeWithKey store={store} />
        ).dive();

        let keyService = component.find(PostExchange).props().keyService
        expect(keyService).toBeInstanceOf(Metamask);
    })
})