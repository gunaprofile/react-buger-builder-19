This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Form Component

* Custom Input component

```jsx
import React from 'react';

import classes from './Input.css';

const input = ( props ) => {
    let inputElement = null;

    switch ( props.elementType ) {
        case ( 'input' ):
            inputElement = <input
                className={classes.InputElement}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
            break;
        case ( 'textarea' ):
            inputElement = <textarea
                className={classes.InputElement}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
            break;
        case ( 'select' ):
            inputElement = (
                <select
                    className={classes.InputElement}
                    value={props.value}
                    onChange={props.changed}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            );
            break;
        default:
            inputElement = <input
                className={classes.InputElement}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    );

};

export default input;
```
* use the defaulyt form in the contact form as below.
* Include the dynamic generated form from input element
```jsx
import Input from '../../../components/UI/Input/Input';
```
* Form the order form as below
```jsx
state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: ''
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: ''
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: ''
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: ''
            },
            radioInput: {
                elementType: 'input',
                elementConfig: {
                    type: 'radio',
                    placeholder: 'Your radio details',
                    options: [
                        {value: 'true', displayValue: 'True'},
                        {value: 'false', displayValue: 'False'}
                    ]
                },
                value: ''
            }
        },
        loading: false
    }
```

* Dynamically create custom form from state value as below
```jsx
render () {
        // Creating formElementsArray from state object
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        // Dynamically creating forms from looping the above array.
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success">ORDER</Button>
            </form>
        );
        if ( this.state.loading ) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
```
* Onchange Listener 
```jsx
inputChangedHandler = (event, inputIdentifier) => {
    //cloned - updatedOrderForm are name , street ,zipcode ... which is same as inputIdentifier
    const updatedOrderForm = {
        ...this.state.orderForm
    };
    //deepcloned - updatedFormElement are elementType, elementConfig and value ... ie deep clone
    const updatedFormElement = { 
        ...updatedOrderForm[inputIdentifier]
    };
    // here we are assigning the values to the updatedFormElement.value  ie  cloned array's value whch is inside name or street or zipcode...
    updatedFormElement.value = event.target.value;
    // Now the updated object/array is assigned to the orderForm's child ie name, street,zipcode ...
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    //Finally we are setting the state object.
    this.setState({orderForm: updatedOrderForm});
}
```
* Order submit  Handler
```jsx
orderHandler = ( event ) => {
    //To avoid default behaviour of page reload.. we are using event.preventDefault();
    event.preventDefault();
    this.setState( { loading: true } );
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
        formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }
    //formData - new order array formed from orderForm
    const order = {
        ingredients: this.props.ingredients,
        price: this.props.price,
        orderData: formData
    }
    axios.post( '/orders.json', order )
        .then( response => {
            this.setState( { loading: false } );
            this.props.history.push( '/' );
        } )
        .catch( error => {
            this.setState( { loading: false } );
        } );
}
```
### Validation

* Custom Validations - validity rules in state's orderForm
```jsx
state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: '',
                valid: true
            }
        },
        formIsValid: false,
        loading: false
    }
```









