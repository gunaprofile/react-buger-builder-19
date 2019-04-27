This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Redux

* install redux and react redux to our project.
```jsx
npm install --save redux react-redux
```
* Now its time to create our store using reducers and actions.js
* in actions.js create contstands for add and remove ingredient handler..
```jsx
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const REMOVE_INGREDIENT = 'REMOVE_INGREDIENT';
```

* reducer.js
```jsx
import * as actionTypes from './actions';

const initialState = {
    // here we initialsise ingredients but in BurgerBuilder  we did ingredients as null and then we will add later..
    ingredients: {
        salad: 0,
        bacon: 0,
        cheese: 0,
        meat: 0
    },
    totalPrice: 4
};

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

const reducer = ( state = initialState, action ) => {
    // we should always have stype property in action, so that we can safely access it here..
    switch ( action.type ) {
        // based on the action type we could logics to the reducers to manage state.
        case actionTypes.ADD_INGREDIENT:
            return {
                // here we are spreading  all state props with new ingredients it will have all state details like totalPrice also
                ...state,
                // here we are setting ingredients to something new
                ingredients: {
                    // here we are spreading ingredients by this we are creating new object ,just speading state won't create deeep copy of object.
                    ...state.ingredients,
                    //ingredientName is payload to the action. which receives new value with increment to 1 eg [salad]:0+1
                    // below is the special syntax used in ES6 to dynamically overwrite a property in a given js object
                    //so here we overwrite the copy we created above..
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
            };
        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
            };
        default:
            return state;
    }
};

export default reducer;
```
* Now  we can create a store.
* This store should be created right before our application starts. so index.js is the right place.
* To connect react with redux we need react-redux package , It allow us to hook up our redux store to react application.

* next we have to wrap our browser component with provider component.
* next we have to create store using createStore method we import from redux
* now we can createStore using reducer
* We wrap our app component inside Provider component from react-redux and then hook our redux store.
* Provider is kind of helper component that allow us to inject redux's store to react component.
```jsx
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './store/reducer';

const store = createStore(reducer);

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
```
* Now our store connected to the app.

* We already provide data to Provider component using store , now we have ti receive the stored data in burger builder controller..
```jsx
//here we import connect to connect this mapStateToProps and mapDispatchToProps with the burgerbuilder
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
//mapStateToProps holds a function which receives the state automatically and which returns the js object where we define which property should hold which slice of the state
//here after can access all state with this.props.ings and this.props.price ...
const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
}
//mapDispatchToProps and assin to onRemovedPerson and onAddedPerson
//here ingredientName is the payload we are providing to these functions
const mapDispatchToProps = dispatch => {
    return {
        // ingName we are getting from BuildControls function
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BurgerBuilder, axios ));

```
* Now apply this.props.ings instead of this.state.ingredients in burger builder controller..
* Similarly we could use onIngredientAdded and onIngredientRemoved instead of add and remove handler..
* Now we can access ingredients and total price from global varible..No need to pass these values as query params
```jsx
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';

class Checkout extends Component {
    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        return (
            <div>
                <CheckoutSummary 
                ingredients={this.props.checkoutIngs}
                checkoutCancelled={this.checkoutCancelledHandler}
                checkoutContinued={this.checkoutContinuedHandler}/>
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    component={ContactData} />
            </div>
        );
    }
}
// here state (ingredients) stored in redux store.. from there we can dynamically fetch state.. 
const mapStateToProps = state => {
    return {
        checkoutIngs: state.ingredients
    }
};

// here nothing gets dispatched we are just redirecting so no need of mapDispatchToProps here..

export default connect(mapStateToProps)(Checkout);
```
* Similarly change contactData.js also







