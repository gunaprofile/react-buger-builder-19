This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Redux Advanced

#### redux-thunk to execute async code in action creators
* In Burger builder container we used to get ingredients from componentDidMount but we temporarily paused that for redux. Now we can use that.
* There are two routes you can take, you can comment in the old code in componentDidMount where we reach out to our firebase backend,
where we fetch the data and instead of calling this.setState here, you could dispatch some action which updates our ingredients in the redux store.
* Then you would run the async code in your component and you wouldn't need action creators at all because
you just dispatch normal actions at the end once the response is there. That is perfectly fine to do but the idea behind action creators is that you can still put your async code into the redux world
* For that i first of all need to install redux-thunk
```jsx
npm install --save redux-thunk
```
* This is the middleware which allows us to use async code in action creators . 
* Now we have to import this thunk and this thunk here now need to be added with applyMiddleware, and since we also have the dev tools added, you'll learn that we also need to import compose and then adjust our dev tool setup.
* Compose allows us to compose our own set of enhancers and middleware is just one kind of enhancer the
dev tools would be another example.
```jsx
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux';
// Refer : https://github.com/zalmoxisus/redux-devtools-extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// use the above enhancer in create store.. and pass apply middleware and to apply middleware pass thunk
const store = createStore(burgerBuilderReducer, composeEnhancers(
    applyMiddleware(ReduxThunk)
));
```
* So now we can start writing async code in our action creators.
#### Executing Async
* Let add action types and action creators
```jsx
export const SET_INGREDIENTS = 'SET_INGREDIENTS';
export const FETCH_INGREDIENTS_FAILED = 'FETCH_INGREDIENTS_FAILED';
```

```jsx
import axios from '../../axios.orders';

export const setIngredients = ( ingredients ) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
};

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
};

export const initIngredients = () => {
    return dispatch => {
        axios.get( 'https://react-buger-3dcbb.firebaseio.com/ingredients.json' )
            .then( response => {
                dispatch(setIngredients(response.data));
            } )
            .catch( error => {
                dispatch(fetchIngredientsFailed());
            } );
    };
};
```
* we can still handle it with the same axios instance which we're passing to the higher order component to show our error modal
which of course is what we want to do still, we want to have this central error handling place.(burgerBuilder container)
```jsx
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BurgerBuilder, axios ));
```
* We are done with actions now we have to update our reducers details
```jsx
    case actionTypes.SET_INGREDIENTS:
        return {
            ...state,
            ingredients: {
                salad: action.ingredients.salad,
                bacon: action.ingredients.bacon,
                cheese: action.ingredients.cheese,
                meat: action.ingredients.meat
            },
            error: false
        };
    case actionTypes.FETCH_INGREDIENTS_FAILED:
     // initially error props set as false if error occurs we are returning error props as true
        return {
            ...state,
            error: true
        };
```
* Burger builder container we need information about the error also
```jsx
const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        error: state.error
    };
}
```
* Make sure to dispatch ingredients init action in mapDispatchToProps..
```jsx
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        //here we are dispatching initIngredients action
        onInitIngredients: (ingName) => dispatch(burgerBuilderActions.initIngredients())
    }
}
```
* Now the last step is to call onInitIngredients in our componentDidMount method.
```jsx
componentDidMount () {
    // this should execute dispatch action... that will fetch our ingredients.
    this.props.onInitIngredients();
}
```
* We already added error properties now we have to use that in appropriate places..
```jsx
// here we updated this.state.error with this.props.error beacuse now we are receiving this as props..
let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
```
#### Adding Async Order action
* Now asusual first of all we have to define action action types.
```jsx
export const PURCHASE_BURGER_SUCCESS = 'PURCHASE_BURGER_SUCCESS';
export const PURCHASE_BURGER_FAIL = 'PURCHASE_BURGER_FAIL';
```
* Once action type added we have to move to order actions.. here we will export PURCHASE_BURGER_SUCCESS and  PURCHASE_BURGER_FAIL with their pay load..
```jsx
import * as actionTypes from './actionTypes';
import axios from '../../axios.orders';

// purchaseBurgerSuccess and purchaseBurgerFail are the two syncronous actions
export const purchaseBurgerSuccess = ( id, orderData ) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    };
};

export const purchaseBurgerFail = ( error ) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
}
// Now lets do Asycronous actions ...

export const purchaseBurger = (orderData) => {
    // This is the action we dispath from the container once we click action button
    return dispatch => {
        axios.post( '/orders.json', orderData )
            .then( response => {
                console.log( response.data );
                // here we are calling purchaseBurgerSuccess action creators
                dispatch( purchaseBurgerSuccess( response.data.name, orderData ) );
            } )
            .catch( error => {
                // here we are calling purchaseBurgerFail action creators
                dispatch( purchaseBurgerFail( error ) );
            } );
    };
};
```
* Please have sure you have imported the exported actions from index.js file
```jsx
export {
    addIngredient,
    removeIngredient,
    initIngredients
} from './burgerBuilder';
export { 
    purchaseBurger
} from './order';
```
* Now in order container ie ContactData.js container add 

```jsx
const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData) => dispatch(contactActions.purchaseBurger(orderData)))
    };
};
```
* Now we have to use this dispatch props in appropriate place as
```jsx
this.props.onOrderBurger(order);
```

* Now we have to add reducer logics
```jsx
import * as actionTypes from '../actions/actionTypes';
// import { updateObject } from '../utility';

const initialState = {
    orders: [],
    loading: false,
    purchased: false
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
       
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            const newOrder ={
                ...action.orderData,
                id: action.orderId
            }
            return {
                ...state,
                loading: false,
                orders: state.orders.concat(newOrder)
            };
        case actionTypes.PURCHASE_BURGER_FAIL: 
            return {
                ...state,
                loading: false,
            };
        default: return state;
    }
};

export default reducer;
```
* Now we have to dispatch purchaseBurgerStart action creator when purchaseBurger action creator dispacthed...
```jsx
export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    };
};
```
* ie dispatch purchaseBurgerStart in  your purchaseBurger action creator
```jsx
export const purchaseBurger = () => {
    return dispatch => {
        dispatch( purchaseBurgerStart() );
        axios.post( '/orders.json', orderData )
            .then( response => {
                console.log( response.data );
                // here we are calling purchaseBurgerSuccess action creators
                dispatch( purchaseBurgerSuccess( response.data.name, orderData ) );
            } )
            .catch( error => {
                // here we are calling purchaseBurgerFail action creators
                dispatch( purchaseBurgerFail( error ) );
            } );
    };
};
```
* Now we have to add  purchaseBurgerStart reducer logic
```jsx
const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.PURCHASE_BURGER_START:
        return {
                ...state,
                loading: true,
        };
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            const newOrder ={
                ...action.orderData,
                id: action.orderId
            }
            return {
                ...state,
                loading: false,
                orders: state.orders.concat(newOrder)
            };
        case actionTypes.PURCHASE_BURGER_FAIL: 
            return {
                ...state,
                loading: false,
            };
        default: return state;
    }
};
```
* Next we have to combine reducers to action before that let us fix a issue in checkout.js container regarding redirect
```jsx
import { Route, Redirect } from 'react-router-dom';

render () {
        let summary = <Redirect to="/" />
        if ( this.props.ings ) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary
                        ingredients={this.props.ings}
                        checkoutCancelled={this.checkoutCancelledHandler}
                        checkoutContinued={this.checkoutContinuedHandler} />
                    <Route
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData} />
                </div>
            );
        }
        return summary;
    }
```

#### Combine reducers
* In index.js of our application let add logics to combine reducers..
```jsx
// To combine reducers lets import combine reducers
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

// we already have burgerBuilderReducer let combine burgerBuilderReducer with orderReducer
const rootReducer = combineReducers({
    burgerBuilder: burgerBuilderReducer,
    order: orderReducer
});

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));
```
* Now we combine both .. since its combine let updte the state with appropriate path
```jsx
const mapStateToProps = state => {
    return {
        contactIngs: state.burgerBuilder.ingredients,
        contactPrice: state.burgerBuilder.totalPrice,
        loading: state.order.loading
    }
};
```
* Refer vedio for rest... we skipped onInitPurchase relatesd stuff in readme..

* As per my suggestions do data transforms in action creators.. refer order action creator fetchOrders function..

* Here we did reducer clean up and switch case statement bit leaner with utility file.
```jsx
export const updateObject = (oldObject, updatedProperties) => {
    // Here we are forming new object which we are distributing the property or newobject ad oldobject and return as single new updated object.
    return {
        ...oldObject,
        ...updatedProperties
    };
};
```
* For example in burgerbuilder reducer to addIngredients
```jsx
const addIngredient = ( state, action ) => {
    // here ingredient updated 
    const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 }
    // updatedIngredients retruning new updated object
    const updatedIngredients = updateObject( state.ingredients, updatedIngredient );
    // The same updateObject utility function can be used again to update state.. as per the updateObject utility function first property should be current object and second object is new object this function will combine both and return the new final updated single object
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
    }
    return updateObject( state, updatedState );
};
```

* Extract logic into seperate function this refraction will help us lot and code will be in more readable form.
* Refer store folder for better understanding...

