This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Add, Remove, Update and Build control component

### BuildControls component
* This is a functional component that return some JSX with Add,Remove Ingredients and Order Button also.
* Add some css to the component as per your wish.
```
import classes from './BuildControls.css';
const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <div> Build controls - child component Build control will come here</div>
        <button className={classes.OrderButton}>ORDER NOW</button>
    </div>
);
```
* Now we have to design/develop build control component which is the child of BuildControls component.
* Here this component will export jsx with add and remove ingerdients button.
* Add some css as per your need
```
import React from 'react';

import classes from './BuildControl.css';

const buildControl = (props) => (
    <div className={classes.BuildControl}>
        <div className={classes.Label}>{props.label}</div>
        <button 
            className={classes.Less} 
            onClick={props.removed} 
            disabled={props.disabled}>Less</button>
        <button 
            className={classes.More} 
            onClick={props.added}>More</button>
    </div>
);

export default buildControl;
```
#### Add Ingredient Control
* Now Add the above child component as multiple copies of component based on a static constant not state/props value in its parent component (BuildControls).
```
const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' },
];

```
* Now as i said create multiple component based on above static controls constant.
```
    const buildControls = (props) => (
    <div className={classes.BuildControls}>
        {controls.map(ctrl => (
            <BuildControl 
                key={ctrl.label} 
                label={ctrl.label}
            />
        ))}
        <button 
            className={classes.OrderButton}
            >ORDER NOW</button>
    </div>
);

```
* Now we have to add a handler(funtion) to add ingredient in BugerBuilderComponent. which will be invoked from BuildControl->BuildControls->BurgerBuilder.
```
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};
addIngredientHandler = ( type ) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
        ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
}

```
* Above addIngredientHandler props will be forward to BuildControls

```
<BuildControls ingredientAdded={this.addIngredientHandler} />
```
* From BuildControls ingredientAdded props will be forward to BuildControl
```
<BuildControl 
    key={ctrl.label} 
    label={ctrl.label}
    added={() => props.ingredientAdded(ctrl.type)}
/>
```
#### Remove Ingredient Control
* follow same login for remove ingredient.
```
removeIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];
        if ( oldCount <= 0 ) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    }
```
* Above removeIngredientHandler props will be forward to BuildControls

```
<BuildControls ingredientAdded={this.addIngredientHandler}  ingredientRemoved={this.removeIngredientHandler}/>
```
* From BuildControls ingredientAdded props will be forward to BuildControl
```
<BuildControl 
    key={ctrl.label} 
    label={ctrl.label}
    added={() => props.ingredientAdded(ctrl.type)}
    removed={() => props.ingredientRemoved(ctrl.type)}
/>
```
* We can't reduce ingredients as negative so that we should disable remove button if it reached Zero count.
* before render that is inside render funtion add the below logic to disable button.
```
render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    removeBtndisabled={disabledInfo}
                />
            </Aux>
        );
    }

```
* Above removeBtndisabled props will be forward to BuildControls
```
<BuildControl 
                key={ctrl.label} 
                label={ctrl.label}
                added={() => props.ingredientAdded(ctrl.type)}
                removed={() => props.ingredientRemoved(ctrl.type)}
                disableRemoveBtn={props.removeBtndisabled[ctrl.type]} />
```
* From BuildControls disableRemoveBtn props will be forward to BuildControl
```
<button 
            className={classes.Less} 
            onClick={props.removed} 
            disabled={props.disableRemoveBtn}
>Less</button>
```

#### Update Buger Price 

* Now pass totalPrice to Build controls from totalPrice state.
```
    <BuildControls
        ingredientAdded={this.addIngredientHandler}
        ingredientRemoved={this.removeIngredientHandler}
        disabled={disabledInfo}
        purchasable={this.state.purchasable}
        price={this.state.totalPrice} 
    />
```
* Burger price will visible on top of add/remove ingredients in Build Controls
```
    <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
```

* No we have to add logic for updatePurchaseState
```
updatePurchaseState (ingredients) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
            // here second param 0 is the staring number, then it will increase based on logic
        this.setState( { purchasable: sum > 0 } );
    }
```
* Based on this enable/diable Order Now Button
```
<button 
    className={classes.OrderButton}
    disabled={!props.purchasable}>
    ORDER NOW
</button>
```
* Now we should call updatePurchaseState after add/ remove ingredients to check the purchasable state.

