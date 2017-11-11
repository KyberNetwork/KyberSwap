import store from '../store';
import React from 'react';
import TransactionLoading from '../../../containers/CommonElements/TransactionLoading';
import { shallow } from 'enzyme';

describe('TransactionLoading', () => {
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
        expect(component.instance().props.broadcasting).toBe(false)
        expect(component.instance().props.error).toBe('Broadcasting error')
    })
})