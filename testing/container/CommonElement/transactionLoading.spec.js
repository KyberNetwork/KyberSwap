import store from '../store';
import React from 'react';
import TransactionLoading from '../../../src/js/containers/CommonElements/TransactionLoading';
import { shallow } from 'enzyme';

describe('TransactionLoading', () => {

    it('render 1 <TransactionLoading /> component', () => {
        const component = shallow(
            <TransactionLoading store={store} />
        ).dive();
        expect(component.length).toBe(1)
    })

    it('Broadcasting success', () => {
        const component = shallow(
            <TransactionLoading store={store}
                broadcasting={true}
            />
        ).dive();
        expect(component.instance().props.broadcasting).toBe(true)
        expect(component.instance().props.error).toBe('')
    })

    it('Broadcasting fail', () => {
        const component = shallow(
            <TransactionLoading store={store}
                broadcasting={false}
                broadcastingError="Broadcasting error"
            />
        ).dive();
        expect(component.instance().props.broadcasting).toBe(true)
        expect(component.instance().props.error).toBe('Broadcasting error')
    })

    it('Cannot Broadcast to network', () => {
        const component = shallow(
            <TransactionLoading store={store}
                broadcasting={false}
                broadcastingError=""
            />
        ).dive();
        expect(component.instance().props.broadcasting).toBe(false)
    })
})