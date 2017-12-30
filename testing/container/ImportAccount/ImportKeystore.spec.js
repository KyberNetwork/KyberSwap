import store from '../store';
import React from 'react';
import ImportKeystore from '../../../src/js/containers/ImportAccount/ImportKeystore';
import DropFile from '../../../src/js/components/CommonElement/DropFile';
import Dropzone from 'react-dropzone';
import BigNumber from "bignumber.js";

import { shallow, mount } from 'enzyme';
import { setTimeout } from 'timers';

describe('ImportKeystore', () => {
    it('render 1 <ImportKeystore /> component', () => {
        const component = shallow(
            <ImportKeystore store={store} />
        ).dive();
        expect(component.length).toBe(1)
    })
})

describe('Test lowerCaseKey function', () => {
    it('input = "0xABCxyz"', () => {
        const component = shallow(
            <ImportKeystore store={store} />
        ).dive();
        let string = component.instance().lowerCaseKey('0xABCxyz');
        expect(string).toBe('0xabcxyz')
    })
})

describe('Test goToExchange function', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });
    it('goToExchange', () => {
        const component = shallow(
            <ImportKeystore store={store} />
        ).dive();
        component.instance().goToExchange();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "@@router/CALL_HISTORY_METHOD",
            payload: { "args": ["/exchange"], "method": "push" }
        });
    })
})

// describe('Test onDrop function', () => {
//     beforeEach(() => {
//         spyOn(store, 'dispatch');
//     });
    
//     it('click "Import by Json" ', (done) => {
//         const component = mount(
//             <ImportKeystore store={store} />,
//         );
//         let keyStore = '{"vdersion":3,"id":"42a81fda-8d1b-4e61-a8ee-8703bc4137b5","address":"12f0453c1947269842c5646df98905533c1b9519","crypto":{"ciphertext":"5ac005ce89f9483b3415e8057e7410a1c06fb11611f811109df79a462fe868d3","cipherparams":{"iv":"8dccbd0a66094ae251f8ec79559fece2"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"0c6d49adde05b145a29acec30fa9961f277fab5a99f09bfe4d25d6a41a9c5e7e","c":10240,"prf":"hmac-sha256"},"mac":"22f6275e7e7064a71768ece7215e2eea8c4d16971f1079b429c9ddefb9d061a2"}}';
//         const file = new Blob([keyStore], { type: 'text/plain' });
//         component.find('input').simulate('change', {
//             target: {
//                 files: [file]
//             }
//         });
//         setTimeout(()=>{
//             expect(store.dispatch).toHaveBeenCalledWith({
//                 type: "ACCOUNT.IMPORT_NEW_ACCOUNT_PENDING",
//                 payload: {
//                     "address": "0x12f0453c1947269842c5646df98905533c1b9519", "avatar": "data:image/svg+xml;base64,dW5kZWZpbmVk", 
//                     "ethereum": {"call": store.getState().connection.ethereum.call}, 
//                     "keystring": keyStore, 
//                     "metamask": null, 
//                     "tokens": [
//                         {
//                             "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", 
//                             "balance": new BigNumber(Math.pow(10, 19)), 
//                             "decimal": 18, "icon": "/assets/img/tokens/eth.svg", "name": "Ethereum", "symbol": "ETH"},
//                         {
//                             "address": "0x1795b4560491c941c0635451f07332effe3ee7b3", 
//                             "balance": new BigNumber(Math.pow(10, 18)), 
//                             "decimal": 9, "icon": "/assets/img/tokens/omg.svg", "name": "OmiseGO","symbol": "OMG"
//                         }
//                     ], 
//                     "type": "keystore"
//                 }
//             });
//             done();
//         })
//     })

//     it('Invalid keystore ', (done) => {
//         const component = mount(
//             <ImportKeystore store={store} />,
//         );
//         let keyStore = 'this is invalid keystore';
//         const file = new Blob([keyStore], { type: 'text/plain' });
//         component.find('input').simulate('change', {
//             target: {
//                 files: [file]
//             }
//         });
//         setTimeout(()=>{
//             expect(store.dispatch).toHaveBeenCalledWith({
//                 type: 'ACCOUNT.THROW_ERROR',
//                 payload: 'Your uploaded JSON file is invalid. Please upload a correct JSON keystore.'
//             });
//             done();
//         })
//     })
// })