import store from '../store';
import React from 'react';
import ImportKeystore from '../../../src/js/containers/ImportAccount/ImportKeystore';
import { shallow } from 'enzyme';

describe('ImportKeystore', () => {
    it('render 1 <ImportKeystore /> component', () => {
        const component = shallow(
            <ImportKeystore store={store} />
        ).dive();
        expect(component.length).toBe(1)
    })
})
describe('Test lowerCaseKey function', () => {
    it('input = "0xABCxyz"', () => {
        const component = shallow(
            <ImportKeystore store={store} />
        ).dive();
        let string = component.instance().lowerCaseKey('0xABCxyz');
        expect(string).toBe('0xabcxyz')
    })
})
describe('Test goToExchange function', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });
    it('goToExchange', () => {
        const component = shallow(
            <ImportKeystore store={store} />
        ).dive();
        component.instance().goToExchange();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "@@router/CALL_HISTORY_METHOD",
            payload: {"args": ["/exchange"], "method": "push"}
        });
    })
})