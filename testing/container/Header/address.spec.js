import store from '../store';
import React from 'react';
import Address from '../../../src/js/containers/Header/Address';
import AddressView from '../../../src/js/components/Header/AddressView';
import { shallow } from 'enzyme';

describe('Address', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('render 1 <Address /> component', () => {
        const component = shallow(
            <Address store={store} />
        ).dive();
        expect(component.length).toBe(1);
    })

    it('Test GLOBAL.CLEAR_SESSION was dispatched ', () => {
        const component = shallow(
            <Address store={store} />
        ).dive();

        let addressView = component.find(AddressView).dive();
        addressView.find('.exit').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith(
            { type: 'GLOBAL.CLEAR_SESSION' }
        );
    })

})