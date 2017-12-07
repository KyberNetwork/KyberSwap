import store from '../store';
import React from 'react';
import SelectToken from '../../../src/js/containers/CommonElements/SelectToken';
import SelectTokenModal from '../../../src/js/components/CommonElement/SelectTokenModal';
import Modal from '../../../src/js/components/CommonElement/MyModal';
import { shallow } from 'enzyme';

describe('SelectToken', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('render 1 <SelectToken /> component', () => {
        const component = shallow(
            <SelectToken store={store} />
        ).dive();
        expect(component.length).toBe(1)
    })

    it('Test hideSelectToken was dispatched ', () => {
        const component = shallow(
            <SelectToken store={store} />
        ).dive();
        let selectTokenView = component.find(SelectTokenModal).dive().find(Modal).dive();
        selectTokenView.find('.x').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith(
            { type: 'UTIL.HIDE_TOKEN_MODAL' }
        );
    })

})