This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Checkout Summary

* Lets create a checkout summary
```jsx
import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.css';
const checkoutSummary = (props) => {
    return (
        <div className={classes.CheckoutSummary}>
            <h1>We hope it tastes well!</h1>
            <div style={{width: '100%', margin: 'auto'}}>
                <Burger ingredients={props.ingredients}/>
            </div>
            <Button 
                btnType="Danger"
                clicked>CANCEL</Button>
            <Button 
                btnType="Success"
                clicked>CONTINUE</Button>
        </div>
    );
}
export default checkoutSummary;
```

* Call this checkout summary in checkout.js
```jsx
import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
class Checkout extends Component {
    state = {
        ingredients: {
            salad: 1,
            meat: 1,
            cheese: 1,
            bacon: 1
        }
    }
    render() {
        return (
            <div>
                <CheckoutSummary ingredients={this.state.ingredients}/>
            </div>
        );
    }
}
export default Checkout;
```
* We can render this in app js below burger builder, but we will show either burger builder or checkout conatiner at a time. 
```jsx
class App extends Component {
    render() {
        return (
            <div>
            <Layout>
                <BurgerBuilder/>
                <Checkout />
            </Layout>
            </div>
        );
    }
}
```
* Install React router dom for adding routing to the app.js
```js
npm install --save react-router-dom
```
* Now we have to wrap our entire app component (index.js) with browser component to enable routing.
```jsx
import { BrowserRouter } from 'react-router-dom';

const app = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

ReactDOM.render(app, document.getElementById('root'));
```

* Now we can use the routing in app.js component 

```jsx
import { Route, Switch } from 'react-router-dom';

class App extends Component {
    render() {
    return (
        <div>
        <Layout>
            <Switch>
            <Route path="/checkout" component={Checkout} />
            <Route path="/" exact component={BurgerBuilder} />
            </Switch>
        </Layout>
        </div>
    );
    }
}
```
* Navigating to checkout page from handler function after submit.
```jsx
this.props.history.push('/checkout');
```
* Now the router only available to the parent component rest of the child component we have to use HOC as below to use router
```jsx
import { withRouter } from 'react-router-dom';
...
....
export default withRouter(burger);
```
* Now you will see the router has the match location and history details.... on console props...

* Navigating to Back previous page and To Next page.
```jsx
checkoutCancelledHandler = () => {
    this.props.history.goBack();
}

checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
}
```
* Passing data via Query Params
```jsx
const queryParams = [];
for (let i in this.state.ingredients) {
    queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
}
const queryString = queryParams.join('&');
this.props.history.push({
    pathname: '/checkout',
    search: '?' + queryString
});
```

* Navigating to new component and loading in the same page below the other component without refreshing the old component.

```jsx
import { Route } from 'react-router-dom';
...
...
<Route 
    path={this.props.match.path + '/contact-data'} 
    render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />)} />
```
* here we are rendering and passinh  prpos to ContactData component.

* Implementing Navigation Link - when using routing..
* from
```jsx
<a 
            href={props.link} 
            className={props.active ? classes.active : null}>{props.children}</a>
```
* To
```jsx
import { NavLink } from 'react-router-dom';
<NavLink 
        to={props.link}
        exact={props.exact}
        activeClassName={classes.active}>{props.children}</NavLink>
```









