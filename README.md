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















