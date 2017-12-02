import store from '../store';
import React from 'react';
import Rate from '../../../src/js/containers/Header/Rate';
import { shallow } from 'enzyme';

describe('Rate', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('render 1 <Rate /> component', () => {
        const component = shallow(
            <Rate store={store}
                location={{pathname: '/'}}
            />
        ).dive();
        expect(component.length).toBe(1);
    })

})