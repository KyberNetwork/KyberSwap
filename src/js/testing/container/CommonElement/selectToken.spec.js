import store from '../store';
import React from 'react';
import SelectToken from '../../../containers/CommonElements/SelectToken';
import { shallow } from 'enzyme';

describe('SelectToken', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });
    it('Test hideSelectToken was dispatched ', () => {
        const component = shallow(
            <SelectToken store={store} />
        ).dive();
        component.instance().closeModal();
        expect(store.dispatch).toHaveBeenCalledWith(
            {"type": "UTIL.HIDE_TOKEN_MODAL"},
        );
    })
    
})