import store from '../store';
import React from 'react';
import Exchange from '../../../src/js/containers/Exchange/Exchange';
import ExchangeForm from '../../../src/js/components/Transaction/ExchangeForm';
import Token from '../../../src/js/containers/CommonElements/Token';
import TokenView from '../../../src/js/components/CommonElement/Token';
import { shallow, mount } from 'enzyme';

describe('Exchange', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
        store.getState().account.isStoreReady = true;
    });

    it('Check account is not imported ', () => {
        store.getState().account.isStoreReady = false;
        const component = mount(
            <Exchange store={store} />
        );
        expect(component.html()).toBe('<div></div>');
    })

    it('Open source token modal ', () => {
        let sourcceToken = "ETH";
        store.getState().exchange.sourceTokenSymbol = sourcceToken;
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();

        const sourceToken = shallow(
            <Token store={store}
                type="source"
                token={sourcceToken}
                onSelected={exchange.instance().openSourceToken}
            />
        ).dive();

        sourceToken.find(TokenView).dive().simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'UTIL.OPEN_TOKEN_MODAL',
            payload: { selected: "ETH", "type": "source" }
        });
    })

    it('Open destination token modal ', () => {
        let destTokenSymbol = "OMG";
        store.getState().exchange.destTokenSymbol = destTokenSymbol;
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();

        const sourceToken = shallow(
            <Token store={store}
                type="des"
                token={destTokenSymbol}
                onSelected={exchange.instance().openDesToken}
            />
        ).dive();

        sourceToken.find(TokenView).dive().simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'UTIL.OPEN_TOKEN_MODAL',
            payload: { selected: "OMG", "type": "des" }
        });
    })
})
