import store from '../store';
import React from 'react';
import ImportByDeviceWithTrezor from '../../../src/js/containers/ImportAccount/ImportByDeviceWithTrezor';
import ImportByLedgerView from '../../../src/js/components/ImportAccount/ImportByLedgerView';
import ImportByDevice from '../../../src/js/containers/ImportAccount/ImportByDevice';
import { shallow } from 'enzyme';

describe('ImportByDeviceWithTrezor', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('render 1 <ImportByDeviceWithTrezor /> component', () => {
        const component = shallow(
            <ImportByDeviceWithTrezor store={store} />
        );
        expect(component.length).toBe(1)
    })
})