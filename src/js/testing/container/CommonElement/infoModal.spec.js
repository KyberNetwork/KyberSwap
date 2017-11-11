import store from '../store';
import React from 'react';
import InfoModal from '../../../containers/CommonElements/InfoModal';
import { shallow } from 'enzyme';

describe('InfoModal', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });
    it('Test closeInfoModal was dispatched ', () => {
        const component = shallow(
            <InfoModal store={store} />
        ).dive();
        component.instance().exitIdleMode();
        expect(store.dispatch).toHaveBeenCalledWith(
            {"type": "UTIL.EXIT_INFO_MODAL"}
        );
    })
})