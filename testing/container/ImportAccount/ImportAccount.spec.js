import store from '../store';
import React from 'react';
import ImportAccount from '../../../src/js/containers/ImportAccount/ImportAccount';
import { shallow } from 'enzyme';

describe('ImportAccount', () => {
    it('render 1 <ImportAccount /> component', () => {
        const component = shallow(
            <ImportAccount store={store} />
        ).dive();
        expect(component.length).toBe(1)
    })
})