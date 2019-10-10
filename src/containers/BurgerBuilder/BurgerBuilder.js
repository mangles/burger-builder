import React, {Component} from 'react'
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        basePrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false

    }

    componentDidMount() {
        axios.get("/ingredients.json")
            .then(response => this.setState({ingredients: response.data}))
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

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.basePrice,
            customer: {
                name: 'Mireia',
                address: {
                    street: 'My street',
                    zipCode: '08012',
                    city: 'Barcelona'
                }
            },
            date: Date.now()

        }
        //.json because is needed in Firebase
        axios.post('/orders.json', order)
            .then(response => this.setState({loading: false, purchasing: false}))
            .catch(error => this.setState({loading: false, purchasing: false}))
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let burger = <Spinner/>
        let orderSummary = null

        if (this.state.ingredients) {
            burger = <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls ingredientAdded={this.addIngredientHandler}
                               ingredientRemoved={this.removeIngredientHandler}
                               disabled={disabledInfo}
                               totalPrice={this.state.basePrice}
                               purchasable={this.state.purchasable}
                               purchasing={this.purchaseHandler}
                />
            </Aux>
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                purchaseContinued={this.purchaseContinueHandler}
                purchaseCancelled={this.purchaseCancelHandler}
                totalPrice={this.state.basePrice}
            />
        }

        if (this.state.loading) {
            orderSummary = <Spinner/>
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios)