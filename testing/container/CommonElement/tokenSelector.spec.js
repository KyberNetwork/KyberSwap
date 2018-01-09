import store from '../store';
import React from 'react';
import TokenSelector from '../../../src/js/containers/CommonElements/TokenSelector';
import { shallow } from 'enzyme';

describe('TokenSelector', () => {
    it('render 1 <TokenSelector /> component', () => {
        const component = shallow(
            <TokenSelector store={store}
                token="ETH"
                type="source"
            />
        ).dive();
        expect(component.length).toBe(1)
    })
})