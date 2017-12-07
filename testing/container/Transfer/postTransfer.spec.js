import store from '../store';
import React from 'react';
import PostTransfer from '../../../src/js/containers/Transfer/PostTransfer';
import PostTransferBtn from '../../../src/js/components/Transaction/PostTransferBtn';
import PassphraseModal from '../../../src/js/components/Transaction/PassphraseModal';
import ConfirmTransferModal from '../../../src/js/components/Transaction/ConfirmTransferModal';

import { shallow, mount } from 'enzyme';
import BigNumber from "bignumber.js";

describe('Set token balance, decimal', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Token is not supported', () => {
        store.getState().transfer.tokenSymbol = 'ABC';
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();
        expect(postTransfer.instance().props.form.balance).toBe(0);
        expect(postTransfer.instance().props.form.decimal).toBe(18);
    })

    it('Token is supported', () => {
        let state = store.getState(),
            tokens = state.tokens.tokens,
            token = 'ETH';
        state.transfer.tokenSymbol = token;
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();
        expect(postTransfer.instance().props.form.balance).toBe(tokens[token].balance);
        expect(postTransfer.instance().props.form.decimal).toBe(tokens[token].decimal);
    })
});

describe('Test validateTransfer function', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Invalid address', () => {
        store.getState().transfer.destAddress = '0xabcxyz...'
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();
        let validate = postTransfer.instance().validateTransfer();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.THROW_ERROR_DEST_ADDRESS',
            payload: 'This is not an address'
        });
        expect(validate).toBe(false)
    })

    it('Gas price = "" ', () => {
        store.getState().transfer.gasPrice = ''
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();
        let validate = postTransfer.instance().validateTransfer();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.THROW_GAS_PRICE_ERROR',
            payload: 'Gas price is not number'
        });
        expect(validate).toBe(false)
    })

    it('Gas price = "string" ', () => {
        store.getState().transfer.gasPrice = 'some string'
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();
        let validate = postTransfer.instance().validateTransfer();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.THROW_GAS_PRICE_ERROR',
            payload: 'Gas price is not number'
        });
        expect(validate).toBe(false)
    })

    it('Amount = "" ', () => {
        store.getState().transfer.gasPrice = ''
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();
        let validate = postTransfer.instance().validateTransfer();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.THROW_AMOUNT_ERROR',
            payload: 'Amount must be a number'
        });
        expect(validate).toBe(false)
    })

    it('Amount = "string" ', () => {
        store.getState().transfer.gasPrice = 'some string'
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        let validate = postTransfer.instance().validateTransfer();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.THROW_AMOUNT_ERROR',
            payload: 'Amount must be a number'
        });
        expect(validate).toBe(false)
    })

    it('Amount is too high ', () => {
        let stateTransfer = store.getState().transfer;
        stateTransfer.destAddress = '0x95b4de7fb8800aab804a23d4185230949b503380';
        stateTransfer.gasPrice = '20';
        stateTransfer.amount = '11';

        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        let validate = postTransfer.instance().validateTransfer();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.THROW_AMOUNT_ERROR',
            payload: 'Amount is too high'
        });
        expect(validate).toBe(false)
    })

    it('Validate true', () => {
        let stateTransfer = store.getState().transfer;
        stateTransfer.destAddress = '0x95b4de7fb8800aab804a23d4185230949b503380';
        stateTransfer.gasPrice = '20';
        stateTransfer.gas = 1000000;
        stateTransfer.amount = '0.1';

        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        let validate = postTransfer.instance().validateTransfer();
        expect(validate).toBe(true)
    })

});

describe('Submit transfer', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Submit transfer by Keystore', () => {
        store.getState().account.account.type = 'keystore';
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        const postTransferBtn = shallow(
            <PostTransferBtn submit={postTransfer.instance().clickTransfer} />
        );

        postTransferBtn.find('.submit-transfer').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.OPEN_PASSPHRASE',
        });
    })

    it('Submit transfer by Trezor', () => {
        store.getState().account.account.type = 'trezor';
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        const postTransferBtn = shallow(
            <PostTransferBtn submit={postTransfer.instance().clickTransfer} />
        );

        postTransferBtn.find('.submit-transfer').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.SHOW_CONFIRM',
        });
    })

    it('Submit transfer by Ledger', () => {
        store.getState().account.account.type = 'ledger';
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        const postTransferBtn = shallow(
            <PostTransferBtn submit={postTransfer.instance().clickTransfer} />
        );
        postTransferBtn.find('.submit-transfer').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.SHOW_CONFIRM',
        });
    })

    it('Submit transfer by Metamask', () => {
        store.getState().account.account.type = 'metamask';
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        const postTransferBtn = shallow(
            <PostTransferBtn submit={postTransfer.instance().clickTransfer} />
        );
        postTransferBtn.find('.submit-transfer').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.SHOW_CONFIRM',
        });
    })
});

describe('PassphraseModal', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Onchange passphare', () => {
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        const passphraseModal = shallow(
            <PassphraseModal onChange={postTransfer.instance().changePassword} />
        );

        passphraseModal.find('#passphrase').simulate('change', {
            target: { value: 'my-password' }
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.CHANGE_PASSPHRASE',
        });
    })
});

describe('Process submit', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Account type is keystore', () => {
        store.getState().account.account.type = 'keystore';
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        const passphraseModal = mount(
            <PassphraseModal onClick={postTransfer.instance().processTx} />,
            { attachTo: document.body }
        );
        passphraseModal.find('.process-submit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.PROCESS_TRANSFER',
            payload: {
                account: {
                    address: "0x12f0453c1947269842c5646df98905533c1b9519", avatar: "", balance: 0, keystring: "", manualNonce: 0, nonce: 0, type: "keystore"
                },
                address: "0x12f0453c1947269842c5646df98905533c1b9519",
                amount: "0x16345785d8a0000",
                data: {
                    amount: "0.1",
                    destAddress: "0x95b4de7fb8800aab804a23d4185230949b503380",
                    tokenSymbol: "ETH"
                },
                destAddress: "0x95b4de7fb8800aab804a23d4185230949b503380",
                ethereum: store.getState().connection.ethereum,
                formId: "transfer",
                gas: "0xf4240", gasPrice: "0x4a817c800", keystring: "", nonce: 0, password: "", token: undefined, type: "keystore"
            }
        });
    })

    it('Account type is trezor || ledger', () => {
        store.getState().account.account.type = 'trezor';
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        const passphraseModal = mount(
            <ConfirmTransferModal onExchange={postTransfer.instance().processTx} />,
        );
        passphraseModal.find('.process-submit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.PROCESS_TRANSFER',
            payload: {
                account: {
                    address: "0x12f0453c1947269842c5646df98905533c1b9519", avatar: "", balance: 0, keystring: "", manualNonce: 0, nonce: 0, type: "trezor"
                },
                address: "0x12f0453c1947269842c5646df98905533c1b9519",
                amount: "0x16345785d8a0000",
                data: {
                    amount: "0.1",
                    destAddress: "0x95b4de7fb8800aab804a23d4185230949b503380",
                    tokenSymbol: "ETH"
                },
                destAddress: "0x95b4de7fb8800aab804a23d4185230949b503380",
                ethereum: store.getState().connection.ethereum,
                formId: "transfer",
                gas: "0xf4240", gasPrice: "0x4a817c800", keystring: "", nonce: 0, password: "", token: undefined, type: "trezor"
            }
        });
    })
});

describe('Close modal', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Close modal passphare', () => {
        store.getState().account.account.type = 'keystore';
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        const passphraseModal = shallow(
            <PassphraseModal onCancel={postTransfer.instance().closeModal} />
        );

        passphraseModal.find('.x').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.HIDE_PASSPHRASE',
        });
    })

    it('Close modal confirm Trezor', () => {
        store.getState().account.account.type = 'trezor';
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        const confirmTransferModal = shallow(
            <ConfirmTransferModal onCancel={postTransfer.instance().closeModal} />
        );

        confirmTransferModal.find('.x').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.HIDE_CONFIRM',
        });
    })

    it('Close modal confirm Ledger', () => {
        store.getState().account.account.type = 'ledger';
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();

        const confirmTransferModal = shallow(
            <ConfirmTransferModal onCancel={postTransfer.instance().closeModal} />
        );

        confirmTransferModal.find('.x').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'TRANSFER.HIDE_CONFIRM',
        });
    })

});

describe('Test recap function', () => {
    it('Recap', () => {
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();
        let result = postTransfer.instance().recap();
        expect(result).toEqual({
            amount: '0.1',
            destAddress: '0x95b4de7fb8800aab804a23d4185230949b503380',
            tokenSymbol: 'ETH'
        });
    });
});

describe('Test formParams function', () => {
    it('formParams', () => {
        const postTransfer = shallow(
            <PostTransfer store={store} />
        ).dive();
        let result = postTransfer.instance().formParams();
        expect(result).toEqual({
            amount: '0x16345785d8a0000',
            destAddress: '0x95b4de7fb8800aab804a23d4185230949b503380',
            "gas": "0xf4240",
            "gasPrice": "0x4a817c800",
            "nonce": 0,
            "selectedAccount": "0x12f0453c1947269842c5646df98905533c1b9519",
            "throwOnFailure": undefined,
            "token": undefined,

        });
    });
});