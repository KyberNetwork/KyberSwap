import store from '../store';
import React from 'react';
import Processing from '../../../src/js/containers/CommonElements/Processing';
import { shallow } from 'enzyme';

describe('Processing', () => {
    it('render 1 <Processing /> component', () => {
        const component = shallow(
            <Processing store={store} />
        ).dive();
        expect(component.length).toBe(1)
    })
})