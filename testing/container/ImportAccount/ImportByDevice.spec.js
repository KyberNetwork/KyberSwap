import store from '../store';
import React from 'react';
import ImportByDevice from '../../../src/js/containers/ImportAccount/ImportByDevice';
import { shallow } from 'enzyme';

jest.mock('getTrezorPublicKey', () => jest.fn())

describe('ImportByDevice', () => {
    it('render 1 <ImportByDevice /> component', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        expect(component.length).toBe(1)
    })

    it('test setDeviceState function', () => {
        const component = shallow(
            <ImportByDevice store={store} />
        ).dive();
        let cData = component.instance();
        cData.setDeviceState();
        expect(cData.addressIndex).toBe(0);
        expect(cData.currentIndex).toBe(0);
        expect(cData.walletType).toBe('trezor');
        expect(cData.generator).toBe(null);
        console.log(component.instance().setDeviceState)
    })
})