
import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({adapter: new Adapter()})

describe('<Navigation Items...>',() => {
    let wrapper;
    beforeEach(()=>{
        wrapper = shallow(<NavigationItems />);
    });
    it('If not authenticated, Should render two navigation items',() => {
        
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    })  
    it('If authenticated, Should render three navigation items',() => {
        // let wrapper = shallow(<NavigationItems  isAuthenticated/>);
        wrapper.setProps({isAuthenticated:true});
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    })  
    it('If authenticated, Should contains logout',() => {
        wrapper.setProps({isAuthenticated:true});
        expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
    })  
    afterEach(()=>{
        console.log("After Each logic #######");
    })
});