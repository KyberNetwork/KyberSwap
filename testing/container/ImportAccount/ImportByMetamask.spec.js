import store from '../store';
import React from 'react';
import ImportByMetamask from '../../../src/js/containers/ImportAccount/ImportByMetamask';
import BigNumber from "bignumber.js";
import { getTranslate } from 'react-localize-redux';

import { shallow, mount } from 'enzyme';

describe('test connect metamask', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Metamask ext not be installed', () => {
        const component = mount(
            <ImportByMetamask store={store} />
        );
        component.find('.importer a').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.THROW_ERROR",
            payload: "Cannot connect to metamask"
        });
    })

    it('Metamask ext was installed', () => {
        const component = shallow(
            <ImportByMetamask store={store} />
        ).dive();
        component.instance().dispatchAccMetamask('');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.IMPORT_ACCOUNT_METAMASK",
            payload: {
                "ethereum": store.getState().connection.ethereum, "networkId": 42, 
                "tokens": [
                    {
                        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", 
                        "balance": new BigNumber(Math.pow(10, 19)), 
                        "decimal": 18, "icon": "/assets/img/tokens/eth.svg", "name": "Ethereum", "symbol": "ETH",
                        "minRate": '0',
                        "minRateETH": '0'
                    },
                    {
                        "address": "0x1795b4560491c941c0635451f07332effe3ee7b3", 
                        "balance": new BigNumber(Math.pow(10, 18)), 
                        "decimal": 9, "icon": "/assets/img/tokens/omg.svg", "name": "OmiseGO","symbol": "OMG",
                        "minRate": '21699393893477488',
                        "minRateETH": '43391211520165175427',
                    }
                ], 
                translate: getTranslate(store.getState().locale),
                "web3Service": ''
            }
        });
    })
})