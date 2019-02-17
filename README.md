This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Implementation
* BugerBulder.js

```
import React, { Component } from 'react';

import Aux from '../../hoc/Aux';

class BurgerBuilder extends Component {
    render () {
        return (
            <Aux>
                <div>Burger</div>
                <div>Build Controls</div>
            </Aux>
        );
    }
}

export default BurgerBuilder;
```
* Import and include in App.js

```
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'

class App extends Component {
    render() {
        return (
            <div>
                <Layout>
                    <BurgerBuilder/>
                </Layout>
            </div>
        );
    }
}
```
* Add CSS to Layout.
```
import classes from './Layout.css';

<main className={classes.Content}>
    {props.children}
</main>
```
* Create New component Buger and Import in BugerBuilder component.
* Create a sub-component inside buger component as BurgerIngredient - stateless compoenet(js and css)
* BurgerIngredient.js
```
import React, { Component } from 'react';

import classes from './BurgerIngredient.css';

class BurgerIngredient extends Component {
    render () {
        let ingredient = null;

        switch ( this.props.type ) {
            case ( 'bread-bottom' ):
                ingredient = <div className={classes.BreadBottom}></div>;
                break;
            case ( 'bread-top' ):
                ingredient = (
                    <div className={classes.BreadTop}>
                        <div className={classes.Seeds1}></div>
                        <div className={classes.Seeds2}></div>
                    </div>
                );
                break;
            case ( 'meat' ):
                ingredient = <div className={classes.Meat}></div>;
                break;
            case ( 'cheese' ):
                ingredient = <div className={classes.Cheese}></div>;
                break;
            case ( 'bacon' ):
                ingredient = <div className={classes.Bacon}></div>;
                break;
            case ( 'salad' ):
                ingredient = <div className={classes.Salad}></div>;
                break;
            default:
                ingredient = null;
        }

        return ingredient;
    }
}


export default BurgerIngredient;
```
### Prop Type Validation
* Install prop types
```
npm install --save prop-types
```
* we could use prop types in both class based and function based component too..
```
import PropTypes from 'prop-types';

BurgerIngredient.propTypes = {
    type: PropTypes.string.isRequired
};

export default BurgerIngredient;
```
* Now we have ingredients lets prepare burger
```
import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = ( props ) => {
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            <BurgerIngredient type="cheese" />
            <BurgerIngredient type="meat" />
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burger;
```
* Now in BurgerBuiler.js replace dummy burger with newly created one with state.

```
import Burger from '../../components/Burger/Burger';
constructor(props) {
        super(props);
        this.state = {
            ingredients: {
                salad: 0,
                bacon: 0,
                cheese: 0,
                meat: 0
            }
        }
    }
<Burger ingredients={this.state.ingredients} />
```
* Now we have to receive this ingredients in burger component.
* Here this ingredients is object not array so we can't use map to loop this props.
* To convert object into array 
```
let transformedIngredients = Object.keys( props.ingredients )
```
* Now the object converted into array with string key.
* With this current array we will use map function to form BurgerIngredient component concatinated based on ingredients props value.
* eg : if we have two chees it will add two chees as BurgerIngredient based on props.ingredients[igKey].
```
let transformedIngredients = Object.keys( props.ingredients )
        .map( igKey => {
            return [...Array( props.ingredients[igKey] )].map( ( _, i ) => { //[2,3,4]

                return <BurgerIngredient key={igKey + i} type={igKey} />; // type="meat" or type="chees" etc
            } );
        } )
```
* Here [...Array( props.ingredients[igKey] )] is the new array formed from props.ingredients.
* Further with the new array we are forming BurgerIngredient by fetcing type (chees, meet) from new array
* here in inner map function "map( ( _, i )" underscore refers to current element ,we don't are about that so that is why we used underscore. we really care about index i.
* Now the response is array of array to reduce this into one single array we will use reduce function as follow
```
.reduce((arr, el) => {
            return arr.concat(el)
        }, []);
```
* FYI here arr is previous value concatinated(updated) array , el is current value and [] is inital value.
* if the state for all ingredients is zero , then we should so some message to user to add ingredients before render
```
if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>;
    }
```
