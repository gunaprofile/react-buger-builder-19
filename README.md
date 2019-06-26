This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
### minor improvement
#### update object utility
* use common update object utility function where ever possible
```jsx
export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};
```
* now we can import and use this utility function anywhere..
```jsx
const authStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};
```
#### unlock the redux dev tool only in devlopment mode .
* Using environment variable (index js file) unlock the redux dev tool, only unlock this if we are in development mode.
From env.js config we can access the Environment (development/ production)
```jsx
const composeEnhancers = process.env.NODE_ENV==='development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  : null || compose;
```
* Here no need to import process which is available globally.
#### Lazy loading.
* Lets create async component
```jsx
import React, { Component } from 'react';

const asyncComponent = (importComponent) => {
    return class extends Component {
        state = {
            component: null
        }

        componentDidMount () {
            importComponent()
                .then(cmp => {
                    this.setState({component: cmp.default});
                });
        }
        
        render () {
            const C = this.state.component;

            return C ? <C {...this.props} /> : null;
        }
    }
}

export default asyncComponent;
```
* How to use the above async component for example (App.js)
```jsx
import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
});

class App extends Component {
  componentDidMount () {
    this.props.onTryAutoSignup();
  }

  render () {
    let routes = (
      <Switch>
        <Route path="/auth" component={asyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );

    if ( this.props.isAuthenticated ) {
      routes = (
        <Switch>
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" component={asyncOrders} />
          <Route path="/logout" component={Logout} />
          <Route path="/auth" component={asyncAuth} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch( actions.authCheckState() )
  };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );

```

### Testing Intro
* Make sure Jest installed with you react create app.(package.json)
* Next we need to install enzyme. we need both jest and enzyme and also two more additional packages to make sure it works correctly with jest and react
```jsx
npm install --save enzyme react-test-renderer enzyme-adapter-react-16
```
* Now lets write test case to a function component (NavigationItems component)- NavigationItems.test.js
```jsx
import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({adapter: new Adapter()})

describe('<Navigation Items...>',() => {
    it('If not authenticated, Should show two navigation items',() => {
        const wrapper = shallow(<NavigationItems />);
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    })  
});
```
* here describe is inbuild function with your create app. this describe function which takes two arguments, the first argument is just description of the test bundles.
* Second argument is the testing function.its a normal js function, here we are going to write our actual test.
* inside the test function we have it(). This is another function which will be just available by inbuild. same like describe first argument is message about the function and then the second argunemt is our actual test logic.
* Here navigation items is one tiny piece for that we no need to load entire app. in this case enzymes comes into picture.let import enzyme
* To connect enzyme to the react version for that we need to import adapter from enzyme-adapter-react-16
* And in enzymes lets import configure and here above the described function, we can now execute configure and pass a javascript object to configure.
* There we should set up an adapter property and assign new adapter as a constructor function,so this adapter is instantiated with new adapter and that's all, with that enzyme is connected.
* Now we have to render navigation item and then we have to look into it. for that enzymes gives us the specific function named shallow
* Shallow is the most popular and best way of rendering react component. Enzymes have two alternatives to render but shallow is the most often method we will use.
* Because one thing shallow does is it renders the component with all its content but the content isn't deeply rendered.
* So the navigation items component here has navigation item components but these are only rendered as placeholders, we don't render the whole sub tree of the component. So shallow is the methid is enough for this scenario.
* For this shallow function we need to import navigationItems componet and pass this navigationItems as JSX to shallow function.
* We ofcourse need to import react even this is test we need to convert this to react create element alternative.
* So now shallow rendering and storing the results in the const (wrapper)
* Now we need to describe our expectation for that we need a expect method which is available globally by the Jest.
* Inside the expect we define our thing we want to check. here i want to check the constant(wrapper) contains certain elements.
* in wrapper we can again use some utility function provided by enzyme. here we used find method to find the navigationitem which is inside navigationItems component. And here make its just the imported constant not the JSX element.
* with that expect we can add our expection logic as we should have two items.
* If we didn't pass isAuthenticated props it will assume it as false..
* now we can run this with (refer package.json scripts)
```jsx
npm test
```
* In case if you are blocking delete the default app test file.
* Here our test passed as we expected this is how we have to write test for our component.
### Testing Continue
* Now lets write another test for the same component with opposite scenario ie if we are authenticated we need three navigation item element.
* for is Authenticated just pass isAuthenticated as props to navigation Item element.
```jsx
import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({adapter: new Adapter()})

describe('<Navigation Items...>',() => {
    it('If not authenticated, Should render two navigation items',() => {
        const wrapper = shallow(<NavigationItems />);
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    })  
    it('If authenticated, Should render three navigation items',() => {
        const wrapper = shallow(<NavigationItems  isAuthenticated/>);
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    })  
});
```
* We can write multiple test cases like this but we could make it more simple with before each and after each function.
```jsx
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
    afterEach(()=>{
        console.log("After Each logic #######");
    })
});
```
* here we used setProps() which is provided by enzyme. either we can use this or we can re assign wrapper variable.
* Refer this jest documentation https://jestjs.io/docs/en/getting-started.html jest is not only for react this is a common javascript testing framework.
* And for Enzyme please refer https://airbnb.io/enzyme/ 
* Lets write one more test with enzyme's contains methods.
```jsx
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
```
### Testing Container
* We had a look at how to test component and now we have look how we have to test container. the tricky part in container is they are connected to the redux store.
* the redux store have some external influence on this component. We no need to test redux store connection and no need to confirm the store has pass the correct state that we can relay on the the redux on that to work correctly.
* so what really we need to access is the component which is behind this container. and one convinent trick is simply export the Burger builder class simply add export before the class
* Now we can import this burger builder class in test file ,now its became normal component and we tollay stripout the connection to redux which is what we want.
```jsx
import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BurgerBuilder } from './BurgerBuilder';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

configure({adapter: new Adapter()})

describe('<Burger builder...>',() => {
    let wrapper;
    beforeEach(()=>{
        wrapper = shallow(<BurgerBuilder onInitIngredients={() =>{}}/>);
    });
    it('Should render build controls when receiving ingredients',() => {
        wrapper.setProps({ings:{salad: 0}});
        expect(wrapper.find(BuildControls)).toHaveLength(1);
    }) 

});
```
* Here we striped out redux and we did this testing . Lets see how to test redux.

### How to test Redux.
* We previously said we don't test connection to redux but are we test redux ?? Do you test that ??? yes!! we will, let see how we will test the redux. 
* But we have to carefully what we are going to test. we are not want to test the most complex of chains of actions and reducers and state. 
* In the end the reducers are the meat we want to test. Testing reducers is super simple they are syncronous so don't have to deal with async code.
* And there are just function that we passes something in and we get something out. Like say for example authentication reducer.(auth.test.js)
* Here we no need enzymes because we are not testing react component. we no need to render anything we just have normal javascript code. We just have functions.
```jsx
import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('Auth reducer',() => {

    it('Should return the intial state',() => {
        expect(reducer(undefined,{})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false
        })
    }) 
    it('Should store the token upon login',() => {
        expect(reducer({
            token: null,
            userId: null,
            error: null,
            loading: false
        },{
            type : actionTypes.AUTH_SUCCESS,
            idToken: 'some-token',
            userId: 'some-userId'
        })).toEqual({
            token: 'some-token',
            userId: 'some-userId',
            error: null,
            loading: false
        })
    }) 

});
```
* Don't complicate much just make sure our reducer works correctly, do we update our components correctly if the input changes , may be we can test do we fired a correct props on click a certain button all these this can be easily tested in isolated unit test.
