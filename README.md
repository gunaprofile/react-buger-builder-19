This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Authentication

#### Getting token from the backend.
* In firebase enable Email Auth support.
* Google firebase rest auth "https://firebase.google.com/docs/reference/rest/auth" and follow this instructions
* send post request to this API "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=[API_KEY]"
* To run this above rest end point we cant use "axios.orders" since the current axios instance URL is different which will be wrong, you can create new axios for this call.
* Or else you can use default axios server than the custom axios instance... beacause we are going to do only one post call.

```jsx
// Import directly from the axios package
import axios from 'axios';


export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDfD-vR7fRF5d3AydxqszNR07HRiwh7077d6ZaC8', authData)
            .then(response => {
                console.log(response);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
            })
            .catch(err => {
                console.log(err);
                dispatch(authFail(err));
            });
    };
};

```
* Refer auth.js action creators. the above api call will return the following response
```jsx

  "kind": "identitytoolkit#SignupNewUserResponse",
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVjZWVhNDg5Y2QyZmQ2NaDEzMTIwNDIzMjRjOTFjMTcyMGM2NmE1N2IiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVhYd3QtYnVnZXItM2RjYmIiLCJhdWQiOiJyZWFjdC1idWdlci0zZGNiYiIsImF1dGhfdGltZSI6MTU1OTYzODU2MiwidXNlcl9pZCI6ImtJUmNFRVBPbUhjfZERkTFpNNGs2dEJ6MHlKNDIaiLCJzdWIiaOiJrSVJjRUVQT21IY2REZExaTTRrNnRCejB5SjQyIiwiaWF0IjoxNTU5NjM4NTYyLCJleHAiOjE1NTk2NDIxNjIsImVtYWlsIjoibGlua2d1bmExQgGdtYWlsLmNvbSIasImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwifZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJsaW5rZ3VuYTFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.jRDh-jA2aDQAAhubnPmtU5oo_LhMmpE2LAZkQ_QAIU9GIWi_MXnpIAUkti8yv8J9yq5OAXhnKBviOQweA9NYw-kYziPvAcjqTVNQA4JH6F1tYHK97rUDdXhHLz8ly_iSQ2DVwCoYOvebDlpHC3vIDb_A_VTySOQCR3wfxDYVTML13XQk8KFvDEx6do-rMNtViclX8SgjzDoFG0ULRrWGq8cW-BL-0KD9KHQeDjUVow1Te7zawmDoHogjd4IIRKKMkopK67GQnIvGGl2yutgLB3qjKHXkygIjWUpdQSoM-KLYkKq9utHZi-BqltCKT8NdxtSkKTSAFSNVcRzHKsa5nw",
  "email": "xyz@gmail.com",
  "refreshToken": "AEu4IL0E8Vgx3ezxAxsdZfh0xQzVJo-fm7t8yXJllliNYCw7-95KfhZeq1esa71NKDHs6IpNsbOVo-eLm5LheTsDcp0ttiBWLsrSMhZ8BzlyAIo2aovTm2ugneu-dg_9gjoTU3cUjx7AR9xyMohL1avdYOReJY18eLHdA4waxweUlZzkxJunNwN6vU2virD2QC6uyOGs_4paH1tlpGt4byYSQhMrFpzsSwLT_CA",
  "expiresIn": "3600",
  "localId": "kIRcEEPOmHcdDddLZM4k6tBz0yJ42"
}
```
* Added signup related changes in Auth.js container please refer
```jsx
 

switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup};
        });
    }
::::::::::::::
:::::::::::::


return (
            <div className={classes.Auth}>
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button 
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        );
```
#### Storing token
* we need to store token because to access protected resources we need token.
```jsx
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false
};

const authStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};

const authSuccess = (state, action) => {
    return updateObject( state, { 
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false
    } );
};

const authFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
}
// in reducer its important to set state to initial state.
const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        default:
            return state;
    }
};

export default reducer;
```
* !!! When we create a new reducer we need to combine that reducer.
```jsx
import authReducer from './store/reducers/auth';

const rootReducer = combineReducers({
    burgerBuilder: burgerBuilderReducer,
    order: orderReducer,
    auth: authReducer
});

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

```
* Added spinner logic, Logout logic and access Protected resources logic.
* For protected resource access logic add the below rules in your fiebase.
```jsx
{
  /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */
  "rules": {
      "ingredients": {
        ".read": "true",
    		".write":"true"
  		},
    	"orders": {
        ".read": "auth!=null",
        ".write":"auth!=null"
  		}
  }
}
```
* With the above rules user can access ingredients without token but not orders.
```jsx
// In fetchOrders actions creators we have tokens
export const fetchOrders = (token) => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        axios.get( '/orders.json?auth=' + token)
            .then( res => {
                const fetchedOrders = [];
                for ( let key in res.data ) {
                    fetchedOrders.push( {
                        ...res.data[key],
                        id: key
                    } );
                }
                dispatch(fetchOrdersSuccess(fetchedOrders));
            } )
            .catch( err => {
                dispatch(fetchOrdersFail(err));
            } );
    };
};
```
* The above token to action creators is passed from mapDispatchToProps in container
```jsx
const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token) => dispatch( actions.fetchOrders(token) )
    };
};
```
* Finally we have to get token in the place of onFetchOrders.to get token in onFetchOrders we already managing token in redux store.
```jsx
const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token
    };
};
```
* From this mapStateToProps we could access token for onFetchOrders.
```jsx
 this.props.onFetchOrders(this.props.token);
```
* Apply the same logic to purchaseBurger action also.
* If the application reload you will lost token you need to signin to access oreders.

#### Update UI based on Auth token
* Once login it would be great to show logout instead of Authenticate .. In the navigationItem define logic based on auth token.
```jsx
const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Burger Builder</NavigationItem>
        {props.isAuthenticated ? <NavigationItem link="/orders">Orders</NavigationItem> : null}
        {!props.isAuthenticated
            ? <NavigationItem link="/auth">Authenticate</NavigationItem>
            : <NavigationItem link="/logout">Logout</NavigationItem>}
    </ul>
);
```
* Since navigationItem component is not class based component so that we can't use redux store here.. since sidedrawer and Toolbar component using navigation component .. both sideDrawer and Toolbar are temple component which is wrapped inside layout class component so here we can use our redux store..
another option is we can use react hook in template component.. but that is not advisable..
```jsx
import { connect } from 'react-redux';

render () {
        return (
            <Aux>
                <Toolbar 
                isAuth={this.props.isAuthenticated}
                drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer
                    isAuth={this.props.isAuthenticated}
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

export default connect( mapStateToProps )( Layout );
```
* Forward this authentication to NavigationItems in sideDrawer and Toolbar component.
```jsx
 <NavigationItems isAuthenticated={props.isAuth}/>
```

* Onclick Logout we need to dispatch logout action and page should redirect..
* we can change Navigation link to button and through button pros we could call a fucntion and do logout redirect and the other way is redirect to logout page that will handle logout logics.. (Logout.js - Class based component)

```jsx
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

class Logout extends Component {
    componentDidMount () {
        this.props.onLogout();
    }

    render () {
        return <Redirect to="/"/>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispatchToProps)(Logout);
```
* the above component will dispatch onLogout action and it will redirect to home. In logout action..
```jsx
export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};
```
* The above action will call reducer and then corresponding authLogout function called and token state is updated to null.
```jsx
const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        default:
            return state;
    }
};

const authLogout = (state, action) => {
    return updateObject(state, { token: null, userId: null });
};
```
* To redirect we can do it in couple of ways one would be to forward the props of this component which will be loaded via the router,
so therefore we could forward this props history and on that history object of the router,

* Another method is very elegant way of redirect
```jsx
import { Redirect } from 'react-router-dom';

.....
....
...
render () {
    return <Redirect to="/"/>;
}

```
* We need to inform route path to load logout component
```jsx
import Logout from './containers/Auth/Logout/Logout';
....
....
<Route path="/logout" component={Logout} />
```
#### Forwarding un authenticated users
```jsx
import { Redirect } from 'react-router-dom';
render () {
        ....
        ...
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to="/"/>
        }

        return (
            <div className={classes.Auth}>
            {errorMessage}
            // if isAuthenticated we are redirection to the base path
            {authRedirect}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button 
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};
```
* FYI    this.props.history.push('/auth'); is come from react router..
#### Persistent Auth state with local storage.
* we can persistent our data in local storage , refer auth.js action.
```jsx
// Set local storage.
localStorage.setItem('token', response.data.idToken);
localStorage.setItem('expirationDate', expirationDate);
localStorage.setItem('userId', response.data.localId);
```
* We have to remove the local storage .
```jsx
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};
```

