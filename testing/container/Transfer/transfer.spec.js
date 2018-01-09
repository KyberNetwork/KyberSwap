import store from '../store';
import React from 'react';
import Transfer from '../../../src/js/containers/Transfer/Transfer';
import TransferForm from '../../../src/js/components/Transaction/TransferForm';
import TokenSelector from '../../../src/js/containers/CommonElements/TokenSelector';
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
            <Transfer store={store} />
        );
        expect(component.html()).toBe('<div></div>');
    })

    it('Import account pedding', () => {
        store.getState().account.account.address = undefined;
        const component = mount(
            <Transfer store={store} />
        );
        expect(component.html()).toBe('<div></div>');
    })
});

describe('Input destination address onchange', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
        store.getState().account.isStoreReady = true;
        store.getState().account.account.address = '0x37522832d0f...';
    });
    it('Input destination address onchange', () => {
        let state = store.getState();
        const transfer = shallow(
            <Transfer store={store} />
        ).dive();
        let input = {
            destAddress: {
                value: state.transfer.destAddress,
                onChange: transfer.instance().onAddressReceiveChange
            },
            amount: {
                value: state.transfer.amount,
                onChange: transfer.instance().onAmountChange
            }
        }
        let errors = {
            destAddress: state.transfer.errors.destAddress,
            amountTransfer: state.transfer.errors.amountTransfer
        }
        let balance = {
            value: 0,
            roundingValue: 0,
        }
        const transferForm = shallow(
            <TransferForm input={input} errors={errors} balance={balance} 
                translate={getTranslate(store.getState().locale)}
            />
        );
        transferForm.find('.hash').simulate('change', {
            target: { value: '0x23f35d...' }
        })
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.TRANSFER_SPECIFY_ADDRESS_RECEIVE',
            payload: '0x23f35d...'
        });
    })
});

describe('Input amount onchange', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });
    it('Input amount onchange', () => {
        let state = store.getState();
        const transfer = shallow(
            <Transfer store={store} />
        ).dive();
        let input = {
            destAddress: {
                value: state.transfer.destAddress,
                onChange: transfer.instance().onAddressReceiveChange
            },
            amount: {
                value: state.transfer.amount,
                onChange: transfer.instance().onAmountChange
            }
        }
        let errors = {
            destAddress: state.transfer.errors.destAddress,
            amountTransfer: state.transfer.errors.amountTransfer
        }
        let balance = {
            value: 0,
            roundingValue: 0,
        }
        const transferForm = shallow(
            <TransferForm input={input} errors={errors} balance={balance}
                translate={getTranslate(store.getState().locale)}
            />
        );
        transferForm.find('.amount-input').simulate('change', {
            target: { value: 0.1 }
        })
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.TRANSFER_SPECIFY_AMOUNT',
            payload: 0.1
        });

    })
});

describe('Select token', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });
    it('Select token', () => {
        const transfer = shallow(
            <Transfer store={store} />
        ).dive();

        const tokenSelect = shallow(
            <TokenSelectorView type="transfer"
                listItem={store.getState().tokens.tokens}
                focusItem="OMG"
                searchWord=""
                selectItem={transfer.instance().chooseToken}
                translate={getTranslate(store.getState().locale)}
            />
        );

        tokenSelect.find('.token-item').simulate('click')
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'UTIL.HIDE_TOKEN_MODAL',
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.SELECT_TOKEN',
            payload: { address: 'ETH', symbol: undefined }
        });
    })
});

describe('Make new transaction', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });
    it('Make new transaction', () => {
        const transfer = shallow(
            <Transfer store={store} />
        ).dive();

        const transactionLoading = shallow(
            <TransactionLoadingView
                txHash="0x035bedb6e3e8b0..."
                makeNewTransaction={transfer.instance().makeNewTransfer}
                translate={getTranslate(store.getState().locale)}
            />
        );

        transactionLoading.find('.new-transaction').simulate('click')
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.MAKE_NEW_TRANSFER',
        });
    })
});

describe('Test change gas', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });
    it('Change gas', () => {
        const transfer = shallow(
            <Transfer store={store} />
        ).dive();

        const transactionConfig = shallow(
            <TransactionConfig
                gasPriceHandler={transfer.instance().specifyGasPrice}
                translate={getTranslate(store.getState().locale)}
            />
        );

        let gasPriceInput = transactionConfig.find('.gas-price-input');

        gasPriceInput.simulate('change', {
            target: { value: 1 }
        });

        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER_SPECIFY_GAS_PRICE',
            payload: 1
        });
    })
});

describe('Test set amount', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });
    it('SourceTokenSymbol = "ABC" (don\'t support) ', () => {
        store.getState().transfer.tokenSymbol = 'ABC';
        const transfer = shallow(
            <Transfer store={store} />
        ).dive();

        transfer.find(TransferForm).dive().find('.value').simulate('click');
        expect(store.dispatch).not.toHaveBeenCalledWith({
            type: 'TRANSFER.TRANSFER_SPECIFY_AMOUNT',
            payload: '0'
        });
    })

    it('SourceTokenSymbol = "ETH", amount too low ', () => {
        store.getState().transfer.tokenSymbol = 'ETH';
        store.getState().tokens.tokens.ETH.balance = new BigNumber(Math.pow(10, 10));
        const transfer = shallow(
            <Transfer store={store} />
        ).dive();

        transfer.find(TransferForm).dive().find('.value').simulate('click');
        expect(store.dispatch).not.toHaveBeenCalledWith({
            type: 'TRANSFER.TRANSFER_SPECIFY_AMOUNT',
            payload: '0'
        });
    })

    it('SourceTokenSymbol = "ETH" ', () => {
        store.getState().transfer.tokenSymbol = 'ETH';
        store.getState().tokens.tokens.ETH.balance = new BigNumber(Math.pow(10, 17));
        const transfer = shallow(
            <Transfer store={store} />
        ).dive();

        transfer.find(TransferForm).dive().find('.value').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.TRANSFER_SPECIFY_AMOUNT',
            payload: '0'
        });
    })
})
