import store from '../store';
import React from 'react';
import { Transfer } from '../../../src/js/containers/Transfer';
import { shallow } from 'enzyme';

describe('shallow', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('render 1 <Transfer /> component', () => {
        const component = shallow(
            <Transfer store={store}
                location={{ pathname: '/transfer' }}
            />
        ).dive();
        expect(component.length).toBe(1);
    })

    it('input in address of transfer', () => {
        const component = shallow(
            <Transfer store={store}
                location={{ pathname: '/transfer' }}
            />
        ).dive();
        component.find('input').simulate('change', {target: {value: 'My new value'}})
        //expect(component.length).toBe(1);
    })

})