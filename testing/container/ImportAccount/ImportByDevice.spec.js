import store from '../store';
import React from 'react';
import ImportByDevice from '../../../src/js/containers/ImportAccount/ImportByDevice';
import { Trezor } from "../../../src/js/services/keys"
import BigNumber from "bignumber.js";

import { shallow } from 'enzyme';
import { setTimeout } from 'timers';

describe('ImportByDevice', () => {
    it('render 1 <ImportByDevice /> component', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        expect(component.length).toBe(1);
    })

    it('test setDeviceState function', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        let instance = component.instance();
        instance.setDeviceState();
        expect(instance.addressIndex).toBe(0);
        expect(instance.currentIndex).toBe(0);
        expect(instance.walletType).toBe('trezor');
        expect(instance.generator).toBe(null);
    })

    it('open modal function', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        let instance = component.instance();
        instance.openModal();
        expect(instance.state.modalOpen).toBe(true);
    })

    it('close modal function', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        let instance = component.instance();
        instance.closeModal();
        expect(instance.state.modalOpen).toBe(false);
    })
})

describe('Connect device', () => {
    const device = {
        getPublicKey: (path) => {
            return new Promise((resolve, reject) => {
                if (path != -1) {
                    resolve({
                        chainCode: '502043d38ba80faa671e464ac92992321b9d28a14b8c373db273f6ebd9faa562',
                        publicKey: '03d41a9cf33c2e39a8c4251827173f49b157c1b72edf32731274f46052b98ae8c4'
                    })
                } else {
                    reject('Error message')
                }
            })
        }
    }

    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('cannot find device service', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        component.instance().connectDevice();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.THROW_ERROR",
            payload: "cannot find device service"
        })
    })

    it('Connect device', (done) => {
        const component = shallow(
            <ImportByDevice store={store} deviceService={device} />
        ).dive();
        component.instance().connectDevice('device', "m/0'/0'/1");
        let expectResult = [
            {
                addressString: '0x0d4f82027b6bf65074aa60ceb78a8a5fb95dd11d',
                index: 0,
                balance: '0',
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
            },
            {
                addressString: '0x78307094cd4f7a726d2af43df95c6b70074b9f56',
                index: 1,
                balance: '0',
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
            },
            {
                addressString: '0x6a4ab9a620628a00ef289e4a0a439ee3c1556686',
                index: 2,
                balance: '0',
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
            },
            {
                addressString: '0xcc1fa994c6783003af485aa3ee79edb1fdb8fb4c',
                index: 3,
                balance: '0',
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
            },
            {
                addressString: '0x71ac0fdfa2b07c4e56f89ad380811f517b00cb37',
                index: 4,
                balance: '0',
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
            }
        ];
        setTimeout(() => {
            expect(component.instance().state.addresses).toEqual(expectResult);
            done();
        }, 0)
    })

    it('Connect device fail', (done) => {
        const component = shallow(
            <ImportByDevice store={store} deviceService={device} />
        ).dive();
        component.instance().connectDevice('device', -1);
        setTimeout(() => {
            expect(component.instance().state.addresses).toEqual([]);
            expect(store.dispatch).toHaveBeenCalledWith({
                type: "ACCOUNT.THROW_ERROR",
                payload: "Error message"
            });
            done();
        }, 0)
    })
})

describe('Generate address', () => {

    it('generate address', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        let data = {
            chainCode: '502043d38ba80faa671e464ac92992321b9d28a14b8c373db273f6ebd9faa562',
            publicKey: '03d41a9cf33c2e39a8c4251827173f49b157c1b72edf32731274f46052b98ae8c4'
        }
        component.instance().generateAddress(data);
        let expectResult = [
            {
                addressString: '0x0d4f82027b6bf65074aa60ceb78a8a5fb95dd11d',
                index: 0,
                balance: -1,
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
            },
            {
                addressString: '0x78307094cd4f7a726d2af43df95c6b70074b9f56',
                index: 1,
                balance: -1,
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
            },
            {
                addressString: '0x6a4ab9a620628a00ef289e4a0a439ee3c1556686',
                index: 2,
                balance: -1,
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
            },
            {
                addressString: '0xcc1fa994c6783003af485aa3ee79edb1fdb8fb4c',
                index: 3,
                balance: -1,
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
            },
            {
                addressString: '0x71ac0fdfa2b07c4e56f89ad380811f517b00cb37',
                index: 4,
                balance: -1,
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
            }
        ]
        expect(component.instance().state.addresses).toEqual(expectResult)
        expect(component.instance().state.currentAddresses).toEqual(expectResult)
        expect(component.instance().addressIndex).toEqual(5)
        expect(component.instance().currentIndex).toEqual(5)
    })

})

describe('Get more address', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('moreAddress function (cannot connect to device)', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        component.instance().moreAddress();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.THROW_ERROR",
            payload: "Cannot connect to trezor"
        })
    })

    it('moreAddress function', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        let data = {
            chainCode: '502043d38ba80faa671e464ac92992321b9d28a14b8c373db273f6ebd9faa562',
            publicKey: '03d41a9cf33c2e39a8c4251827173f49b157c1b72edf32731274f46052b98ae8c4'
        }
        let instance = component.instance();
        instance.generateAddress(data);
        instance.moreAddress();
        expect(instance.state.addresses.length).toBe(10)
        expect(instance.state.currentAddresses.length).toBe(5)
        expect(instance.addressIndex).toBe(10)
        expect(instance.currentIndex).toBe(10)
    })


    it('Is first list of address', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        let data = {
            chainCode: '502043d38ba80faa671e464ac92992321b9d28a14b8c373db273f6ebd9faa562',
            publicKey: '03d41a9cf33c2e39a8c4251827173f49b157c1b72edf32731274f46052b98ae8c4'
        }
        let instance = component.instance();
        instance.generateAddress(data);
        instance.moreAddress();
        expect(instance.state.isFirstList).toBe(false)
    })
})

describe('Get pre address', () => {
    it('preAddress function', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        let data = {
            chainCode: '502043d38ba80faa671e464ac92992321b9d28a14b8c373db273f6ebd9faa562',
            publicKey: '03d41a9cf33c2e39a8c4251827173f49b157c1b72edf32731274f46052b98ae8c4'
        }
        let instance = component.instance();
        instance.generateAddress(data);
        instance.moreAddress();
        instance.preAddress();
        expect(instance.currentIndex).toBe(5);
        expect(instance.state.isFirstList).toBe(true);

        instance.moreAddress();
        instance.moreAddress();
        expect(instance.state.isFirstList).toBe(false);
    })
})

describe('Import address was chose', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('getAddress function', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        component.instance().getAddress({});
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'ACCOUNT.IMPORT_NEW_ACCOUNT_PENDING',
            payload: {
                "address": undefined, "avatar": undefined,
                "ethereum": store.getState().connection.ethereum, "keystring": undefined, "metamask": null,
                "tokens": [
                    { "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", "balance": new BigNumber(Math.pow(10, 19)), "decimal": 18, "icon": "/assets/img/tokens/eth.svg", "name": "Ethereum", "symbol": "ETH" }, { "address": "0x1795b4560491c941c0635451f07332effe3ee7b3", "balance": new BigNumber(Math.pow(10, 18)), "decimal": 9, "icon": "/assets/img/tokens/omg.svg", "name": "OmiseGO", "symbol": "OMG" }],
                "type": undefined
            }
        });
    })
})

describe('Choose path', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('choosepath function', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        component.instance().choosePath();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.LOADING"
        })
    })
})

describe('GetBalance', () => {
    it('getBalance function', (done) => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        component.instance().getBalance().then(data => {
            expect(data).toBe('0');
            done();
        });
    })
})

describe('Add balance', () => {
    it('addBalance function', (done) => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        component.instance().setState({
            addresses: [
                {
                    addressString: '0x0d4f82027b6bf65074aa60ceb78a8a5fb95dd11d',
                    index: 0,
                    balance: 1,
                    avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk'
                },
            ]
        })
        component.instance().addBalance('0x1v3e4ds21cds3', 0);
        setTimeout(() => {
            expect(component.instance().state.currentList)
            .toEqual(
                [ { addressString: '0x0d4f82027b6bf65074aa60ceb78a8a5fb95dd11d',
                index: 0,
                balance: '0',
                avatar: 'data:image/svg+xml;base64,dW5kZWZpbmVk' } ] 
            );
            done()
        },0)

    })
})

describe('Showloading', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('showloading function', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        let instance = component.instance();
        instance.showLoading();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.LOADING"
        })
    })
})