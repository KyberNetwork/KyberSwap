import store from '../store';
import React from 'react';
import ExchangeHistory from '../../../src/js/containers/CommonElements/ExchangeHistory';
import HistoryExchange from '../../../src/js/components/CommonElement/HistoryExchange';
import { shallow } from 'enzyme';

describe('ExchangeHistory', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('render 1 <ExchangeHistory /> component', () => {
        const component = shallow(
            <ExchangeHistory store={store} />
        ).dive();
        expect(component.length).toBe(1)
    })

    it('Test showFirst function ', () => {
        store.getState().global.history.itemPerPage = 10
        const component = shallow(
            <ExchangeHistory store={store} />
        ).dive();
        const historyExchange = shallow(
            <HistoryExchange store={store}
                logs={[]}
                first={component.instance().showFirst}
            />
        );
        historyExchange.find('.first').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "GLOBAL.UPDATE_HISTORY_EXCHANGE",
            payload: { "ethereum": store.getState().connection.ethereum, "isAutoFetch": false, "itemPerPage": 10, "page": 0 }
        });
    })
})

describe('Test showNext function', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('page = 5, itemPerPage = 10, eventsCount = 50', () => {
        store.getState().global.history.page = 5
        store.getState().global.history.itemPerPage = 10
        store.getState().global.history.eventsCount = 20
        const component = shallow(
            <ExchangeHistory store={store} />
        ).dive();
        const historyExchange = shallow(
            <HistoryExchange store={store}
                logs={[]}
                next={component.instance().showNext}
            />
        );
        historyExchange.find('.next').simulate('click');
        expect(store.dispatch).not.toHaveBeenCalled();
    })

    it('page = 5, itemPerPage = 10, eventsCount = 60', () => {
        store.getState().global.history.page = 5
        store.getState().global.history.itemPerPage = 10
        store.getState().global.history.eventsCount = 60
        const component = shallow(
            <ExchangeHistory store={store} />
        ).dive();
        const historyExchange = shallow(
            <HistoryExchange store={store}
                logs={[]}
                next={component.instance().showNext}
            />
        );
        historyExchange.find('.next').simulate('click');
        expect(store.dispatch).not.toHaveBeenCalled();
    })

    it('page = 5, itemPerPage = 10, eventsCount = 70', () => {
        store.getState().global.history.page = 5
        store.getState().global.history.itemPerPage = 10
        store.getState().global.history.eventsCount = 70
        const component = shallow(
            <ExchangeHistory store={store} />
        ).dive();
        const historyExchange = shallow(
            <HistoryExchange store={store}
                logs={[]}
                next={component.instance().showNext}
            />
        );
        historyExchange.find('.next').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "GLOBAL.UPDATE_HISTORY_EXCHANGE",
            payload: {"ethereum": store.getState().connection.ethereum, "isAutoFetch": false, "itemPerPage": 10, "page": 6}
        });
    })
});

describe('Test showPrevious function', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('page = 0', () => {
        store.getState().global.history.page = 0
        const component = shallow(
            <ExchangeHistory store={store} />
        ).dive();
        const historyExchange = shallow(
            <HistoryExchange store={store}
                logs={[]}
                previous={component.instance().showPrevious}
            />
        );
        historyExchange.find('.previous').simulate('click');
        expect(store.dispatch).not.toHaveBeenCalled();
    })

    it('page = 5', () => {
        store.getState().global.history.page = 5
        const component = shallow(
            <ExchangeHistory store={store} />
        ).dive();
        const historyExchange = shallow(
            <HistoryExchange store={store}
                logs={[]}
                previous={component.instance().showPrevious}
            />
        );
        historyExchange.find('.previous').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "GLOBAL.UPDATE_HISTORY_EXCHANGE",
            payload: {"ethereum": store.getState().connection.ethereum, "isAutoFetch": false, "itemPerPage": 10, "page": 4}
        });
    })
});