This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Get data from Backend
### Ingredients
* Now we have to add some ingredients data in firebase DB as new node with some data.
* Now we got the URL to access ingredients "https://react-buger-3dcbb.firebaseio.com/ingredients"
```js
componentDidMount () {
    axios.get( 'https://react-buger-3dcbb.firebaseio.com/ingredients.json' )
    .then( response => {
            this.setState( { ingredients: response.data } );
    } )
    .catch( error => {
        this.setState( { error: true } );
    } );
}
```
* But before component mount we should set the ingredients as null, this will cause error.
* Use burger details as new variable if ingredients loaded we will show or else we will show spinner until ingredients load.

```js
let orderSummary = null;
let burger = this.state.error ? <p>Ingredients can not be loaded!</p> : <Spinner />;

if ( this.state.ingredients ) {
    burger = (
        <Aux>
            <Burger ingredients={this.state.ingredients} />
            <BuildControls
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                purchasable={this.state.purchasable}
                ordered={this.purchaseHandler}
                price={this.state.totalPrice} />
        </Aux>
    );
    orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />;
}
return (
    <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            {orderSummary}
        </Modal>
            {burger}  
    </Aux>
);

```
* In case if you give some wrong URL we won't get any error from interceptor.
* In GET Request componentWillMount will load before componentDidMount so that it won't catch any error. But this will work fine with POST request.
* To avoid this issue add catch block to GET request which is inside componentDidMount. then show spinner or common error message...

### Remove Old Interceptor.
* with error handler method can be wrapped around multiple components.That's the whole idea of having this higher order component.
* If we add these higher order component with error handler to other components we'll call component will mount again and again.
* Once we have more pages where we might use with error handler we of course create this instance here multiple times this component here and  so all the   interceptors we set up when we wrapped this around another component which might not be needed anymore still exist. But this is not reqired right??
* So we have to remove this interceptor when we unmount.

```js
componentWillMount () {
    this.reqInterceptor = axios.interceptors.request.use(req => {
        this.setState({error: null});
        return req;
    });
    this.resInterceptor = axios.interceptors.response.use(res => res, error => {
        this.setState({error: error});
    });
}
componentWillUnmount() {
    axios.interceptors.request.eject(this.reqInterceptor);
    axios.interceptors.response.eject(this.resInterceptor);
}
```














