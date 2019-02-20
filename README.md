This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Improvements
### Prop Type Validatipn
### Improving Performance
* Order summany when will update ??
* convert Order summary into class based component
```
import React, { Component } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
    // This could be a functional component, doesn't have to be a class
    componentWillUpdate() {
        console.log('[OrderSummary] WillUpdate');
    }

    render () {
        const ingredientSummary = Object.keys( this.props.ingredients )
            .map( igKey => {
                return (
                    <li key={igKey}>
                        <span style={{ textTransform: 'capitalize' }}>{igKey}</span>: {this.props.ingredients[igKey]}
                    </li> );
            } );

        return (
            <Aux>
                <h3>Your Order</h3>
                <p>A delicious burger with the following ingredients:</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <p><strong>Total Price: {this.props.price.toFixed( 2 )}</strong></p>
                <p>Continue to Checkout?</p>
                <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
                <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
            </Aux>
        );
    }
}

export default OrderSummary;
```
* you could see the orderSummary get updated eventhough its not visible. that is not necessary right .
* Now let's move to model component and convet model component also into class based component alternatively you could keep this as functional compoenet and wrap this with reat memo as we see before.

```
class Modal extends Component {
    // This could be a functional component, doesn't have to be a class
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.show !== this.props.show){
            console.log('[Modal] shouldComponentUpdate');
            return true
        }else{
            return false
        }
        
    }
    componentWillUpdate() {
        console.log('[Modal] WillUpdate');
    }
    render(){
        return (
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div
                    className={classes.Modal}
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}>
                    {this.props.children}
                </div>
            </Aux>
        )
    }
    
}

export default Modal;
```

* beacuse of the above improvement we improved app's performance , now we don't see unnecessary rendering.







