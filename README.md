This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Validation

* Custom Validations - validity rules in state's orderForm
```jsx
// Here we are setting valid false initially.
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
                //Only if the elememt touched we have to check the validation. so initially it should be false.
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
* 
```jsx
//her we will check our rules valid or not.
checkValidity(value, rules) {
    // Here we are checking the rules one by one, so in-case if last rule alone true others are false also it will work as valid value ie true for isValid
    // To avoid this we are setting the initial isValid as true and then we are checking wheather all the previous conditions also true by adding isValid also with the other condition
    // This will make sure that all the rules are statisfied.
    let isValid = true;
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    return isValid;
}
```
* Calling check validity - inputChangedHandler
```jsx
// here since input changed so we are setting element touched 
updatedFormElement.touched = true;
updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
```

* Pass the invalid details to the input component
```jsx
<Input 
    key={formElement.id}
    elementType={formElement.config.elementType}
    elementConfig={formElement.config.elementConfig}
    value={formElement.config.value}
    //here we are getting invalid props
    invalid={!formElement.config.valid}
    // Only the element that has validation rules alone need to check valid or not 
    shouldValidate={formElement.config.validation}
    // Passing the touched param to the Input component.
    touched={formElement.config.touched}
    changed={(event) => this.inputChangedHandler(event, formElement.id)} />
```
* Based on these props we need to do some css changes
```jsx
const inputClasses = [classes.InputElement];

if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
}
```
* Applying invalid class with existing input class.
```jsx
className={inputClasses.join(' ')}
```
* We're not showing any error messages in our form, but you can of course easily add some.
* The form inputs (```<Input />```  component) already receives the information whether it's invalid or not. You could of course easily add some conditionally rendered element inside of that component.
* For example (inside ```<Input />```  component function):

```jsx
let validationError = null;
if (props.invalid && props.touched) {
    validationError = <p>Please enter a valid value!</p>;
}
return (
    <div className={classes.Input}>
        <label className={classes.Label}>{props.label}</label>
        {inputElement}
        {validationError}
    </div>
);
```
* This could of course be finetuned. You could also pass the value type (e.g. "email address" ) as a prop:
```jsx
validationError = <p>Please enter a valid {props.valueType}</p>; 
```
* You could also receive the complete error message as a prop:
```jsx
validationError = <p>{props.errorMessage}</p>; 
```
* And of course, also don't forget to style the messages if you want to do that:
```jsx
validationError = <p className={classes.ValidationError}>{props.errorMessage}</p>;
```
```css
.ValidationError {
    color: red;
    margin: 5px 0;
} 
```

### Overall Form Validity

* we have to check all elements are valid ie overall form validity.(inputChangedHandler)

```jsx
let formIsValid = true;
for (let inputIdentifier in updatedOrderForm) {
    formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
}
this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
```
* based on that formIsValid we have to disable order button
```jsx
<Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
```
* Since Button is our custom component we have to send the props to the button component
```jsx
<button
        disabled={props.disabled}
        onClick={props.clicked}>{props.children}</button>
```
### Error - TypeError: Cannot read property 'required' of undefined
* Since dropdown don't have validation object we are getting this error , we can avoid this by adding empty validation object
```jsx
deliveryMethod: {
    elementType: 'select',
    elementConfig: {
        options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
        ]
    },
    validation: {},
    value: '',
    valid: true
}
```
* Second approach - if rules ie validation not set simply return true.
```jsx
checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        ...
        ...
}
```








