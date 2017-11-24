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
            payload: { "currentBlock": undefined, "ethereum": undefined, "isFirstPage": true, "range": undefined }
        });
    })
})

describe('Test showNext function', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('toBlock = 10, range = 5', () => {
        store.getState().global.history.toBlock = 10;
        store.getState().global.history.range = 5
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
            payload: { "currentBlock": 5, "ethereum": undefined, "isFirstPage": false, "range": 5 }
        });
    })

    it('toBlock = 10, range = 10', () => {
        store.getState().global.history.toBlock = 10;
        store.getState().global.history.range = 10
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
});

describe('Test showPrevious function', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch')
    });

    it('isFirstPage = true', () => {
        store.getState().global.history.isFirstPage = true;
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

    it('toBlock + range < currentBlock', () => {
        store.getState().global.history.isFirstPage = false;
        store.getState().global.history.toBlock = 10;
        store.getState().global.history.range = 5
        store.getState().global.history.currentBlock = 20
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
            payload: { "currentBlock": 15, "ethereum": undefined, "isFirstPage": false, "range": 5 }
        });
    })

    it('toBlock + range > currentBlock', () => {
        store.getState().global.history.isFirstPage = false;
        store.getState().global.history.toBlock = 10;
        store.getState().global.history.range = 5
        store.getState().global.history.currentBlock = 14
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
            payload: { "currentBlock": undefined, "ethereum": undefined, "isFirstPage": true, "range": 5 }
        });
    })

    it('toBlock + range = currentBlock', () => {
        store.getState().global.history.isFirstPage = false;
        store.getState().global.history.toBlock = 10;
        store.getState().global.history.range = 5
        store.getState().global.history.currentBlock = 15
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
            payload: { "currentBlock": undefined, "ethereum": undefined, "isFirstPage": true, "range": 5 }
        });
    })
});