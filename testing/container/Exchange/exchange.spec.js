import store from '../store';
import React from 'react';
import Exchange from '../../../src/js/containers/Exchange/Exchange';
import ExchangeForm from '../../../src/js/components/Transaction/ExchangeForm';
import TokenSelectorView from '../../../src/js/components/CommonElement/TokenSelectorView';
import TransactionLoadingView from '../../../src/js/components/Transaction/TransactionLoadingView';
import TransactionConfig from '../../../src/js/components/Transaction/TransactionConfig';
import { getTranslate } from 'react-localize-redux';

import { shallow, mount } from 'enzyme';
import BigNumber from "bignumber.js"

describe('Check account is not imported', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
        store.getState().account.isStoreReady = true;
    });

    it('No acccount imported', () => {
        store.getState().account.isStoreReady = false;
        const component = mount(
            <Exchange store={store} />
        );
        expect(component.html()).toBe('<div></div>');
    })

    it('Import account pedding', () => {
        store.getState().account.account.address = undefined;
        const component = mount(
            <Exchange store={store} />
        );
        expect(component.html()).toBe('<div></div>');
    })
});

describe('Select token', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
        store.getState().account.isStoreReady = true;
        store.getState().account.account.address = '0x37522832d0f...';
    });
    it('Choose token', () => {
        store.getState().exchange.sourceTokenSymbol = 'OMG';
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();

        const tokenSelect = shallow(
            <TokenSelectorView type="exchange"
                listItem={store.getState().tokens.tokens}
                focusItem="OMG"
                searchWord=""
                selectItem={exchange.instance().chooseToken}
                translate={getTranslate(store.getState().locale)}
            />
        );

        tokenSelect.find('.token-item').simulate('click')
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.SELECT_TOKEN_ASYNC',
            payload: { address: 'ETH', ethereum: store.getState().connection.ethereum, symbol: undefined, type: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' }
        });
    })
});

describe('Input amount onchange', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Source amount onchange', () => {
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();
        let input = {
            sourceAmount: {
                onChange: exchange.instance().changeSourceAmount
            },
            destAmount: {}
        }
        let errors = {
            selectSameToken: '',
            selectTokenToken: '',
            sourceAmount: '',
        }
        let exchangeRate = {}
        let balance = {}
        const exchangeForm = shallow(
            <ExchangeForm input={input}
                errors={errors}
                exchangeRate={exchangeRate}
                balance={balance}
                translate={getTranslate(store.getState().locale)}
            />
        );

        exchangeForm.find('.source-input').simulate('change', {
            target: { value: 0.1 }
        })
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.INPUT_CHANGE',
            payload: { "focus": "source", "value": 0.1 }
        });

        exchangeForm.find('.source-input').simulate('change', {
            target: { value: -1 }
        })
        expect(store.dispatch).not.toHaveBeenCalledWith({
            type: 'EXCHANGE.INPUT_CHANGE',
            payload: { "focus": "source", "value": -1 }
        });
    })

    it('Des amount onchange', () => {
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();
        let input = {
            sourceAmount: {},
            destAmount: {
                onChange: exchange.instance().changeDestAmount
            }
        }
        let errors = {
            selectSameToken: '',
            selectTokenToken: '',
            sourceAmount: '',
        }
        let exchangeRate = {}
        let balance = {}
        const exchangeForm = shallow(
            <ExchangeForm input={input}
                errors={errors}
                exchangeRate={exchangeRate}
                balance={balance}
                translate={getTranslate(store.getState().locale)}
            />
        );

        exchangeForm.find('.des-input').simulate('change', {
            target: { value: 0.1 }
        })
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.INPUT_CHANGE',
            payload: { "focus": "dest", "value": 0.1 }
        });

        exchangeForm.find('.des-input').simulate('change', {
            target: { value: -1 }
        })
        expect(store.dispatch).not.toHaveBeenCalledWith({
            type: 'EXCHANGE.INPUT_CHANGE',
            payload: { "focus": "dest", "value": -1 }
        });
    })
});

describe('Input amount focus', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Input source amount focus', () => {
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();
        let input = {
            sourceAmount: {
                onFocus: exchange.instance().focusSource
            },
            destAmount: {}
        }
        let errors = {
            selectSameToken: '',
            selectTokenToken: '',
            sourceAmount: '',
        }
        let exchangeRate = {}
        let balance = {}
        const exchangeForm = shallow(
            <ExchangeForm input={input}
                errors={errors}
                exchangeRate={exchangeRate}
                balance={balance}
                translate={getTranslate(store.getState().locale)}
            />
        );

        exchangeForm.find('.source-input').simulate('focus')
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.FOCUS_INPUT',
            payload: 'source'
        });
    })

    it('Input des amount focus', () => {
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();
        let input = {
            sourceAmount: {},
            destAmount: {
                onFocus: exchange.instance().focusDest
            }
        }
        let errors = {
            selectSameToken: '',
            selectTokenToken: '',
            sourceAmount: '',
        }
        let exchangeRate = {}
        let balance = {}
        const exchangeForm = shallow(
            <ExchangeForm input={input}
                errors={errors}
                exchangeRate={exchangeRate}
                balance={balance}
                translate={getTranslate(store.getState().locale)}
            />
        );

        exchangeForm.find('.des-input').simulate('focus')
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.FOCUS_INPUT',
            payload: 'dest'
        });
    })
});

describe('Test make new transaction', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
        store.getState().account.isStoreReady = true;
    });
    it('Make new transaction', () => {
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();

        const transactionLoading = shallow(
            <TransactionLoadingView
                txHash="0x035bedb6e3e8b0..."
                makeNewTransaction={exchange.instance().makeNewExchange}
                translate={getTranslate(store.getState().locale)}
            />
        );

        transactionLoading.find('.new-transaction').simulate('click', {})
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.MAKE_NEW_EXCHANGE',
        });
    })
});

describe('Test change gas', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
        store.getState().account.isStoreReady = true;
    });
    it('Change gas', () => {
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();

        const transactionConfig = shallow(
            <TransactionConfig
                gasPriceHandler={exchange.instance().specifyGasPrice}
                translate={getTranslate(store.getState().locale)}
            />
        );

        let gasPriceInput = transactionConfig.find('.gas-price-input');

        gasPriceInput.simulate('change', {
            target: { value: 1 }
        });

        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.SPECIFY_GAS_PRICE',
            payload: '1'
        });
    })
});

describe('Test set amount', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
        store.getState().account.isStoreReady = true;
    });

    it('SourceTokenSymbol = "ETH", amount too low ', () => {
        store.getState().exchange.sourceTokenSymbol = 'ETH';
        store.getState().tokens.tokens.ETH.balance = new BigNumber(Math.pow(10, 10));
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();

        exchange.find(ExchangeForm).dive().find('.value').simulate('click');
        expect(store.dispatch).not.toHaveBeenCalledWith({
            type: 'EXCHANGE.CHANGE_SOURCE_AMOUNT',
            payload: '0'
        });
    })

    it('SourceTokenSymbol = "ETH" ', () => {
        store.getState().exchange.sourceTokenSymbol = 'ETH';
        store.getState().tokens.tokens.ETH.balance = new BigNumber(Math.pow(10, 17));
        const exchange = shallow(
            <Exchange store={store} />
        ).dive();

        exchange.find(ExchangeForm).dive().find('.value').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.INPUT_CHANGE',
            payload: { "focus": "source", "value": "0" }
        });
    })
})
