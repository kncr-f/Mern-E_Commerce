import axios from "axios";
import { CART_ADD_ITEM } from "../constants/cartConstants";
import { CART_REMOVE_ITEM } from "../constants/cartConstants";

export const addCartItem = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            quantity

        }
    })

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems))

}

export const removeCartItem = (id) => async (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    })
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems))

}