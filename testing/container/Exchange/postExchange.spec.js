import store from '../store';
import React from 'react';
import PostExchange from '../../../src/js/containers/Exchange/PostExchange';
import PostExchangeBtn from '../../../src/js/components/Transaction/PostExchangeBtn';
import PassphraseModal from '../../../src/js/components/Transaction/PassphraseModal';
import ConfirmTransferModal from '../../../src/js/components/Transaction/ConfirmTransferModal';
import ApproveModal from '../../../src/js/components/Transaction/ApproveModal';
import { getTranslate } from 'react-localize-redux';

import { shallow, mount } from 'enzyme';
import BigNumber from "bignumber.js";

describe('Set token balance, decimal', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Source token is not supported', () => {
        store.getState().exchange.sourceTokenSymbol = 'ABC';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        expect(postExchange.instance().props.form.sourceBalance).toBe(0);
        expect(postExchange.instance().props.form.sourceDecimal).toBe(18);
    })

    it('Source token is supported', () => {
        let state = store.getState(),
            tokens = state.tokens.tokens,
            token = 'ETH';
        state.exchange.sourceTokenSymbol = token;
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        expect(postExchange.instance().props.form.sourceBalance).toBe(tokens[token].balance);
        expect(postExchange.instance().props.form.sourceDecimal).toBe(tokens[token].decimal);
    })

    it('Des token is not supported', () => {
        store.getState().exchange.destTokenSymbol = 'ABC';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        expect(postExchange.instance().props.form.destDecimal).toBe(18);
    })

    it('Des token is supported', () => {
        let state = store.getState(),
            tokens = state.tokens.tokens,
            token = 'ETH';
        state.exchange.destTokenSymbol = token;
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        expect(postExchange.instance().props.form.destDecimal).toBe(tokens[token].decimal);
    })
});

describe('Test validateExchange function', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Amount = "" ', () => {
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        let validate = postExchange.instance().validateExchange();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.THROW_SOURCE_AMOUNT_ERROR',
            payload: 'error.source_amount_is_not_number'
        });
        expect(validate).toBe(false)
    });

    it('Amount = "string" ', () => {
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        let validate = postExchange.instance().validateExchange();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.THROW_SOURCE_AMOUNT_ERROR',
            payload: 'error.source_amount_is_not_number'
        });
        expect(validate).toBe(false)
    });

    it('Source amount too high', () => {
        let state = store.getState().exchange;
        state.sourceAmount = '11';
        state.sourceTokenSymbol = 'ETH';
        state.minConversionRate = '41236869442900555448';
        state.destTokenSymbol = 'OMG';
        state.offeredRateBalance = "9760098430126006545406";

        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        let validate = postExchange.instance().validateExchange();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.THROW_SOURCE_AMOUNT_ERROR',
            payload: 'error.source_amount_too_high'
        });
        expect(validate).toBe(false)
    });

    it('Source amount too high (reserve does not have enough balance)', () => {
        let state = store.getState().exchange;
        state.sourceAmount = '5000000';
        state.sourceTokenSymbol = 'OMG';
        state.minConversionRate = '21402481527408379';
        state.destTokenSymbol = 'ETH';
        state.offeredRateBalance = "40192252689521327237";

        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        let validate = postExchange.instance().validateExchange();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.THROW_SOURCE_AMOUNT_ERROR',
            payload: 'error.source_amount_too_high'
        });
        expect(validate).toBe(false)
    });

    it('Source amount too low ', () => {
        store.getState().exchange.sourceAmount = '0.000000000000000001';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        let validate = postExchange.instance().validateExchange();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.THROW_SOURCE_AMOUNT_ERROR',
            payload: 'error.source_amount_too_small'
        });
        expect(validate).toBe(false)
    });

    it('Gas price = "" ', () => {
        store.getState().transfer.gasPrice = ''
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        let validate = postExchange.instance().validateExchange();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.THROW_GAS_PRICE_ERROR',
            payload: 'Gas price is not number'
        });
        expect(validate).toBe(false)
    })

    it('Gas price = "string" ', () => {
        store.getState().transfer.gasPrice = 'some string'
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        let validate = postExchange.instance().validateExchange();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.THROW_GAS_PRICE_ERROR',
            payload: 'Gas price is not number'
        });
        expect(validate).toBe(false)
    })

    it('Validate true', () => {
        let state = store.getState().exchange;
        state.sourceAmount = '0.1';
        state.sourceTokenSymbol = 'ETH';
        state.minConversionRate = '41236869442900555448';
        state.destTokenSymbol = 'OMG';
        state.offeredRateBalance = "9760098430126006545406";
        state.gasPrice = 20;
        state.gas = 1000000;

        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        let validate = postExchange.instance().validateExchange();
        expect(validate).toBe(true)
    })
});

describe('Test approveTx function', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Submit approveTx', () => {
        store.getState().exchange.maxDestAmount = 5789604;
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const approveModal = shallow(
            <ApproveModal onSubmit={postExchange.instance().processExchangeAfterApprove} 
                translate={getTranslate(store.getState().locale)}
            />
        );
        approveModal.find('.submit-approve').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.PROCESS_APPROVE',
            payload: {
                "account": {
                    "address": "0x12f0453c1947269842c5646df98905533c1b9519", "avatar": "", "balance": 0, "keystring": "", "manualNonce": 0, "nonce": 0, "type": "keystore"
                },
                "accountType": "keystore", "ethereum": store.getState().connection.ethereum, "gas": "0xf4240", "gasPrice": "0x4a817c800", "keyService": undefined, "keystring": "", "nonce": 0, "password": undefined, "sourceAmount": "0x16345785d8a0000", "sourceToken": undefined
            }
        });
    })
});

describe('Submit exchange', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });
    it('Go to step 2', () => {
        store.getState().exchange.step = 1;
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const postExchangeBtn = shallow(
            <PostExchangeBtn submit={postExchange.instance().clickExchange}
                translate={getTranslate(store.getState().locale)}
            />
        );

        postExchangeBtn.find('.submit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.GO_TO_STEP', payload: 2
        });
    });

    it('Submit by keystore', () => {
        store.getState().exchange.step = 2;
        store.getState().account.account.type = 'keystore';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const postExchangeBtn = shallow(
            <PostExchangeBtn submit={postExchange.instance().clickExchange} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        postExchangeBtn.find('.submit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.OPEN_PASSPHRASE'
        });
    });

    it('Submit by privateKey', () => {
        store.getState().exchange.step = 2;
        store.getState().account.account.type = 'privateKey';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const postExchangeBtn = shallow(
            <PostExchangeBtn submit={postExchange.instance().clickExchange} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        postExchangeBtn.find('.submit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.SHOW_CONFIRM'
        });
    });

    it('Submit by Ledger', () => {
        store.getState().exchange.step = 2;
        store.getState().account.account.type = 'ledger';
        store.getState().exchange.sourceTokenSymbol = 'ETH';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const postExchangeBtn = shallow(
            <PostExchangeBtn submit={postExchange.instance().clickExchange} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        postExchangeBtn.find('.submit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.SHOW_CONFIRM'
        });
    })

    it('Submit by Trezor', () => {
        store.getState().exchange.step = 2;
        store.getState().account.account.type = 'trezor';
        store.getState().exchange.sourceTokenSymbol = 'ETH';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const postExchangeBtn = shallow(
            <PostExchangeBtn submit={postExchange.instance().clickExchange} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        postExchangeBtn.find('.submit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.SHOW_CONFIRM',
        });
    })

    it('Submit by Metamask', () => {
        store.getState().exchange.step = 2;
        store.getState().account.account.type = 'metamask';
        store.getState().exchange.sourceTokenSymbol = 'ETH';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const postExchangeBtn = shallow(
            <PostExchangeBtn submit={postExchange.instance().clickExchange} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        postExchangeBtn.find('.submit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.SHOW_CONFIRM',
        });
    })

    it('Submit by device, token is not ETH', () => {
        store.getState().exchange.step = 2;
        store.getState().account.account.type = 'trezor';
        store.getState().exchange.sourceTokenSymbol = 'OMG';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const postExchangeBtn = shallow(
            <PostExchangeBtn submit={postExchange.instance().clickExchange} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        postExchangeBtn.find('.submit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.CHECK_TOKEN_BALANCE_COLD_WALLET',
            payload: { "account": { "address": "0x12f0453c1947269842c5646df98905533c1b9519", "avatar": "", "balance": 0, "keystring": "", "manualNonce": 0, "nonce": 0, "type": "trezor" }, "address": "0x12f0453c1947269842c5646df98905533c1b9519", "data": { "destAmount": "", "destTokenSymbol": "OMG", "sourceAmount": "0.1", "sourceTokenSymbol": "OMG" }, "destAddress": "0x12f0453c1947269842c5646df98905533c1b9519", "destToken": undefined, "ethereum": store.getState().connection.ethereum, "formId": "exchange", "gas": "0xf4240", "gasPrice": "0x4a817c800", "keyService": undefined, "keystring": "", "maxDestAmount": "0x8000000000000000000000000000000000000000000000000000000000000000", "minConversionRate": "0x2dbfd82316cd0745", "nonce": 0, "password": "", "sourceAmount": "0x5f5e100", "sourceToken": undefined, "throwOnFailure": undefined, "type": "trezor" }
        });
    })
});

describe('Close modal', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Close modal passphare', () => {
        store.getState().account.account.type = 'keystore';
        store.getState().exchange.sourceTokenSymbol = 'ETH';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const passphraseModal = shallow(
            <PassphraseModal onCancel={postExchange.instance().closeModal} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        passphraseModal.find('.x').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.HIDE_PASSPHRASE',
        });
    })

    it('Close modal confirm Trezor', () => {
        store.getState().account.account.type = 'trezor';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const confirmTransferModal = shallow(
            <ConfirmTransferModal onCancel={postExchange.instance().closeModalConfirm} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        confirmTransferModal.find('.x').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.HIDE_CONFIRM',
        });
    })

    it('Close modal confirm Ledger', () => {
        store.getState().account.account.type = 'ledger';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const confirmTransferModal = shallow(
            <ConfirmTransferModal onCancel={postExchange.instance().closeModalConfirm} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        confirmTransferModal.find('.x').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.HIDE_CONFIRM',
        });
    })

    it('Close modal Approve', () => {
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const confirmTransferModal = shallow(
            <ConfirmTransferModal onCancel={postExchange.instance().closeModalApprove} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        confirmTransferModal.find('.x').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.HIDE_APPROVE',
        });
    })
});

describe('PassphraseModal', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Onchange passphare', () => {
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const passphraseModal = shallow(
            <PassphraseModal onChange={postExchange.instance().changePassword} 
                translate={getTranslate(store.getState().locale)}
            />
        );

        passphraseModal.find('#passphrase').simulate('change', {
            target: { value: 'my-password' }
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.CHANGE_PASSPHRASE',
        });
    });
});

describe('Proccess transaction', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Account type is keystore', () => {
        store.getState().account.account.type = 'keystore';
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();

        const passphraseModal = mount(
            <PassphraseModal onClick={postExchange.instance().processTx} 
                translate={getTranslate(store.getState().locale)}
            />,
            { attachTo: document.body }
        );
        passphraseModal.find('.process-submit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'EXCHANGE.PROCESS_EXCHANGE',
            payload: { "account": { "address": "0x12f0453c1947269842c5646df98905533c1b9519", "avatar": "", "balance": 0, "keystring": "", "manualNonce": 0, "nonce": 0, "type": "keystore" }, "address": "0x12f0453c1947269842c5646df98905533c1b9519", "data": { "destAmount": "", "destTokenSymbol": "OMG", "sourceAmount": "0.1", "sourceTokenSymbol": "ETH" }, "destAddress": "0x12f0453c1947269842c5646df98905533c1b9519", "destToken": undefined, "ethereum": store.getState().connection.ethereum, "formId": "exchange", "gas": "0xf4240", "gasPrice": "0x4a817c800", "keyService": undefined, "keystring": "", "maxDestAmount": "0x8000000000000000000000000000000000000000000000000000000000000000", "minConversionRate": "0x2dbfd82316cd0745", "nonce": 0, "password": "", "sourceAmount": "0x16345785d8a0000", "sourceToken": undefined, "throwOnFailure": undefined, "type": "keystore",
            "balanceData": {
                "dest": "1000000000000000000",
                "source": "10000000000000000000",
                },
            }
        });
    })
});

describe('Test getDesAmount function', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });
    it('sourceAmount = 0.1 , offeredRate = 41372700402948563190', () => {
        store.getState().exchange.sourceAmount = "0.1";
        store.getState().exchange.offeredRate = "41372700402948563190";
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        expect(postExchange.instance().getDesAmount()).toBe(4.137270040294856)
    })

    it('sourceAmount = 0.1 , offeredRate = 0', () => {
        store.getState().exchange.sourceAmount = "0.1";
        store.getState().exchange.offeredRate = "0";
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        expect(postExchange.instance().getDesAmount()).toBe(0)
    })
});

describe('Test recap function', () => {
    it('Recap', () => {
        store.getState().exchange.destAmount = 0;
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        let result = postExchange.instance().recap();
        expect(result).toEqual({
            destAmount: 0,
            destTokenSymbol: "OMG",
            sourceAmount: "0.1",
            sourceTokenSymbol: "ETH"
        });
    });
});

describe('Test formParams function', () => {
    it('formParams', () => {
        const postExchange = shallow(
            <PostExchange store={store} />
        ).dive();
        let result = postExchange.instance().formParams();
        expect(result).toEqual({
            "destAddress": "0x12f0453c1947269842c5646df98905533c1b9519",
            "destToken": undefined,
            "balanceData": {
                  "dest": "1000000000000000000",
                  "source": "10000000000000000000",
            },
            "gas": "0xf4240",
            "gasPrice": "0x4a817c800",
            "maxDestAmount": "0x8000000000000000000000000000000000000000000000000000000000000000",
            "minConversionRate": "0x0",
            "nonce": 0,
            "selectedAccount": "0x12f0453c1947269842c5646df98905533c1b9519",
            "sourceAmount": "0x16345785d8a0000",
            "sourceToken": undefined,
            "throwOnFailure": undefined,
        });
    });
});