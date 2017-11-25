import store from '../store';
import React from 'react';
import ImportByPrivateKey from '../../../src/js/containers/ImportAccount/ImportByPrivateKey';
import ImportByPKeyView from '../../../src/js/components/ImportAccount/ImportByPKeyView';
import Modal from '../../../src/js/components/CommonElement/MyModal'
import { shallow, mount } from 'enzyme';

describe('ImportByPrivateKey', () => {
    it('render 1 <ImportByPrivateKey /> component', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        expect(component.length).toBe(1)
    })
})

describe('Open close modal', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Open modal', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        const importByPKeyView = shallow(
            <ImportByPKeyView
                modalOpen={component.instance().openModal.bind(component.instance())}
            />
        );
        importByPKeyView.find('#importPKey').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.OPEN_PKEY_MODAL",
        });
    })

    it('Close modal', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        const importByPKeyView = shallow(
            <ImportByPKeyView
                onRequestClose={component.instance().closeModal.bind(component.instance())}
            />
        );
        importByPKeyView.find(Modal).dive().find('.x').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.CLOSE_PKEY_MODAL",
        });
    })
})

describe('Input passphare change', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Input passphare change', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        const importByPKeyView = shallow(
            <ImportByPKeyView
                onChange={component.instance().inputChange.bind(component.instance())}
            />
        );
        importByPKeyView.find(Modal).dive().find('#private_key').simulate('change', {
            target: { value: '0ffffffffffff' }
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.PKEY_CHANGE",
            payload: "0ffffffffffff"
        });
    })
})

describe('Import PrivateKey', () => {
    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    it('Import PrivateKey', () => {
        const component = shallow(
            <ImportByPrivateKey store={store} />
        ).dive();
        const importByPKeyView = shallow(
            <ImportByPKeyView
                importPrivateKey={component.instance().importPrivateKey.bind(component.instance())}
            />,
            { attachTo: document.body }
        );
        importByPKeyView.find(Modal).dive().find('#submit_pkey').simulate('click');
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "ACCOUNT.PKEY_CHANGE",
            payload: "0ffffffffffff"
        });
    })
})