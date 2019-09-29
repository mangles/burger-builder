import React from 'react'
import Aux from '../../../hoc/Aux'
import Button from '../../UI/Button/Button'

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients).map(iKey =>{
        return (<li key={iKey}>
            <span style={{textTransform: 'capitalize'}}>{iKey}</span>: {props.ingredients[iKey]}
            </li>)
    })
    return(
        <Aux>
            <h3>YOUR ORDER</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {props.totalPrice.toFixed(2)} € </strong></p>
            <p>Continue to Checkout?</p>
            <Button btnType='Success' clicked={props.purchaseContinued}>CONTINUE</Button>
            <Button btnType='Danger' clicked={props.purchaseCancelled}>CANCEL</Button>
        </Aux>
    )

}

export default orderSummary