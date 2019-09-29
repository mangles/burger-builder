import React, {Component} from 'react'
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            cheese: 0,
            meat: 0,
            bacon: 0
        },
        basePrice: 4,
        purchasable: false

    }

    addIngredientHandler = (type) => {
        const updatedCounted = this.state.ingredients[type] + 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCounted
        const priceAddition = INGREDIENT_PRICES[type]
        const totalPrice = this.state.basePrice + priceAddition
        this.setState({basePrice: totalPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients)

    }

    removeIngredientHandler = (type) => {
        if (this.state.ingredients[type] > 0) {
            const updatedCounted = this.state.ingredients[type] - 1
            const updatedIngredients = {
                ...this.state.ingredients
            }
            updatedIngredients[type] = updatedCounted
            const priceDeduction = INGREDIENT_PRICES[type]
            const totalPrice = this.state.basePrice - priceDeduction
            this.setState({basePrice: totalPrice, ingredients: updatedIngredients})
            this.updatePurchaseState(updatedIngredients)
        }
    }

    updatePurchaseState = (ingredients) => {
        const numberOfIngredients = Object.keys(ingredients).map(iKey => {
            return ingredients[iKey]
        }).reduce((sum, el) => sum + el, 0)

        this.setState({purchasable: numberOfIngredients > 0})
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        return (
            <Aux>
                <div>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls ingredientAdded={this.addIngredientHandler}
                                   ingredientRemoved={this.removeIngredientHandler}
                                   disabled={disabledInfo}
                                   totalPrice={this.state.basePrice}
                                   purchasable={this.state.purchasable}
                    />
                </div>
            </Aux>
        )
    }
}

export default BurgerBuilder