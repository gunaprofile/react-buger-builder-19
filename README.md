This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Server Access - Firebase
* Here we are going to use [firebase] (https://console.firebase.google.com) for our server details.
* Create a new project for react buger app. This will act as a DB. Male sure your are using real time database
* Change your rules to read and write to true.
* Now install Axios to your project, you can use other ajax pack also but axios is recomended
```js
    npm install --save axios
```
### Axios instances
* Create a new file axios.orders.js 

```
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-buger-3dcbb.firebaseio.com/'
});

export default instance;
```
* Add baseURL form firebase DB. Now we have successfully created axios instances.
### Send Request.
 * To send data once user click continue button.
 * Before that we have to create a UI spinner component.

```js
    import React from 'react';

    import classes from './Spinner.css';

    const spinner = () => (
        <div className={classes.Loader}>Loading...</div>
    );

    export default spinner;
```
* Import this spinner wherever we need.like before post data and the release after saved...

```js
import axios from '../../axios.orders';
import Spinner from '../../components/UI/Spinner/Spinner';

    this.setState( { loading: true } );
    const order = {
        ingredients: this.state.ingredients,
        price: this.state.totalPrice,
        customer: {
            name: 'Guna',
            address: {
                street: 'Muthunagar',
                zipcode: '628501',
                country: 'India'
            },
            email: 'test@test.com',
            deliveryMethod: 'fastest'
        }
    }
    axios.post( '/orders.json', order )
        .then( response => {
            this.setState({ loading: false, purchasing: false });
        } )
        .catch( error => {
            this.setState({ loading: false, purchasing: false });
        } );

// In modal check if loading true , show loading before ordersummary
//########### in render #########
let orderSummary = <OrderSummary 
                    ingredients={this.state.ingredients}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    price={this.state.totalPrice} />;
if ( this.state.loading ) {
    //### Enable spinner here
    orderSummary = <Spinner />;
}

<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
    {orderSummary}
</Modal>
```
* Now data saved to firebase server.

* But here spinner enabled but it will not show because Model not updated this change because in model component , shouldComponentUpdate we are just checking nextProps.show but we have to check nextProps.children also because here children changed but shouldComponentUpdate don't know about this so we have to inform this change also to shouldComponentUpdate.
```js
shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.show !== this.props.show || nextProps.children !== this.props.children){
            console.log('[Modal] shouldComponentUpdate');
            return true
        }else{
            return false
        }
        
}
```













