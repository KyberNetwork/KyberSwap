import store from '../store';
import React from 'react';
import Token from '../../../src/js/containers/CommonElements/Token';
import { shallow } from 'enzyme';

describe('Token', () => {
    it('render 1 <Token /> component', () => {
        const component = shallow(
            <Token store={store}
                token="ETH"
                type="source"
            />
        ).dive();
        expect(component.length).toBe(1)
    })
})