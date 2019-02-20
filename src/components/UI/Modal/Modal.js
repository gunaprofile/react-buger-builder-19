import React, {Component} from 'react';

import classes from './Modal.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';

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