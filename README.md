This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Model, Backdrop component.
### Model Component
* Simple no need to explain..
```
import React from 'react';

import classes from './Modal.css';
import Aux from '../../../hoc/Aux';

const modal = ( props ) => (
    <Aux>
        <div
            className={classes.Modal}
            {props.children}
        </div>
    </Aux>
);

export default modal;
```
### Order Summary 

* Use the above model in buger builder component to show order Summary.Lets create order summary as seperate component inside buger component
```
import React from 'react';

import Aux from '../../../hoc/Aux';

const orderSummary = ( props ) => {
    const ingredientSummary = Object.keys( props.ingredients )
        .map( igKey => {
            return (
                <li key={igKey}>
                    <span style={{ textTransform: 'capitalize' }}>{igKey}</span>: {props.ingredients[igKey]}
                    // igKey is ingredient name eg: salad or meet...
                </li> );
        } );

    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
                //eg: <li>Salad:2</li>
            </ul>
            <p>Continue to Checkout?</p>
        </Aux>
    );
};
```
### Pass order summary component to model which is in burger builder
```
<Modal>
    <OrderSummary ingredients={this.state.ingredients} />
</Modal>
```
* Now we have to handle model based on "purchaseHandler" ,"purchaseCancelHandler" state value
```
purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        alert('You continue!');
    }
//in JSX return

<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
    <OrderSummary 
        ingredients={this.state.ingredients}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />
</Modal>

....
....

<BuildControls
ingredientAdded={this.addIngredientHandler}
ingredientRemoved={this.removeIngredientHandler}
disabled={disabledInfo}
purchasable={this.state.purchasable}
ordered={this.purchaseHandler}
price={this.state.totalPrice} />
```
* Conditionally show hide model based on show props of model.
* Model.js
```
    style={{
                transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                opacity: props.show ? '1' : '0'
            }}>
```
### Create Backdrop component
```
import React from 'react';

import classes from './Backdrop.css';

const backdrop = (props) => (
    props.show ? <div className={classes.Backdrop} onClick={props.clicked}></div> : null
);

export default backdrop;
```
* Use the above backdrop in model component, onClick of backdrop model should close so that we have added clicked handler below.

```
import Backdrop from '../Backdrop/Backdrop';
<Backdrop show={props.show} clicked={props.modalClosed} />
```
### Button component in order summary.
* here we used button class with conditionally dynamic class as stings , join(' ') is used to convert arry of strings to strings.
```
import React from 'react';

import classes from './Button.css';

const button = (props) => (
    <button
        className={[classes.Button, classes[props.btnType]].join(' ')}
        onClick={props.clicked}>{props.children}</button>
);

export default button;
```
* Use button commponent in order summary component
```
import Button from '../../UI/Button/Button';

//In JSX...
<Button btnType="Danger" clicked={props.purchaseCancelled}>CANCEL</Button>
<Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>
```
* purchaseCancelled and purchaseContinued will be passed from orderSummary which is the child of Model as below

```
<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
    <OrderSummary 
        ingredients={this.state.ingredients}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />
</Modal>
```
* Add Total pricing details to Order sumary also. refer code.




