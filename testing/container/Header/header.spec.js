import store from '../store';
import React from 'react';
import Header from '../../../src/js/containers/Header/Header';
import { shallow } from 'enzyme';

describe('Header', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('render 1 <Header /> component', () => {
        let state = store.getState();
        state.router = {};
        state.router.location = {};
        state.router.location.pathname = '/';
        const component = shallow(
            <Header store={store} />
        ).dive();
        expect(component.length).toBe(1);
    })

})