import store from '../store';
import React from 'react';
import Header from '../../../src/js/containers/Header/Header';
import { shallow } from 'enzyme';

describe('Header', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('render 1 <Header /> component', () => {
        const component = shallow(
            <Header store={store}
                location={{pathname: '/'}}
            />
        ).dive();
        expect(component.length).toBe(1);
    })

})