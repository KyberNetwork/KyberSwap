import store from '../store';
import React from 'react';
import ImportByDeviceWithLedger from '../../../src/js/containers/ImportAccount/ImportByDeviceWithLedger';
import ImportByLedgerView from '../../../src/js/components/ImportAccount/ImportByLedgerView';
import ImportByDevice from '../../../src/js/containers/ImportAccount/ImportByDevice';
import { shallow } from 'enzyme';

describe('ImportByDeviceWithLedger', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('render 1 <ImportByDeviceWithLedger /> component', () => {
        const component = shallow(
            <ImportByDeviceWithLedger store={store} />
        );
        expect(component.length).toBe(1)
    })
})