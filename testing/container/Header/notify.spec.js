import store, { txs } from '../store';
import React from 'react';
import Notify from '../../../src/js/containers/Header/Notify';
import NotifyView from '../../../src/js/components/Header/NotifyView';
import { shallow } from 'enzyme';

describe('Address', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('render 1 <Notify /> component', () => {
        const component = shallow(
            <Notify store={store} />
        ).dive();
        expect(component.length).toBe(1);
    })

    it('Test UTIL.TOGGLE_NOTIFY was dispatched ', () => {
        const component = shallow(
            <Notify store={store} />
        ).dive();
        let notifyView = component.find(NotifyView).dive();
        notifyView.find('.notifications-toggle').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith(
            { type: 'UTIL.TOGGLE_NOTIFY' }
        );
    })

    it('Test TX.CLEAR was dispatched ', () => {
        store.getState().txs['0x420aa223b3cd206977ffe...'] = {
            data: {},
            hash: '0x420aa223b3cd206977ffe01198377d56e1e8ab8044bedb8015ff3487a1cd3c49',
        };
        store.getState().utils.showNotify = true;

        const component = shallow(
            <Notify store={store} />
        ).dive();
        let notifyView = component.find(NotifyView).dive();
        notifyView.find('.notifications-toggle').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith(
            { type: 'UTIL.TOGGLE_NOTIFY' }
        );
        expect(store.dispatch).toHaveBeenCalledWith(
            { type: 'TX.CLEAR' }
        );
    })

})