import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem } from "react-bootstrap";

import CheckoutSteps from '../components/CheckoutSteps';
import React from 'react';
import Error from "../components/Error";
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';

const PlaceOrderScreen = ({ history }) => {
    const cart = useSelector((state) => state.cart);
    console.log("cart...", cart)
    const dispatch = useDispatch();
    //Calculate prices

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    }

    cart.itemsPrice = addDecimals(cart.cartItems.reduce((add, item) => add + item.price * item.quantity, 0));
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    const orderCreate = useSelector(state => state.orderCreate);
    const { order, success, error } = orderCreate;

    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`)
        }
        // eslint-disable-next-line
    }, [history, success])

    const handlePlaceOrder = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }))
    }
    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <h2>Shipping</h2>
                            <p>
                                <strong>
                                    Address: {" "}
                                </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city},
                                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
                            </p>
                        </ListGroupItem>

                        <ListGroupItem>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>
                                    Method:{" "}
                                </strong>
                                {cart.paymentMethod}

                            </p>
                        </ListGroupItem>

                        <ListGroupItem>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? <Error>Your Cart is Empty</Error> :
                                (
                                    <ListGroup variant="flush">
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroupItem key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />

                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.quantity} x ${item.price} = ${item.quantity * item.price}
                                                    </Col>

                                                </Row>

                                            </ListGroupItem>
                                        ))}

                                    </ListGroup>
                                )
                            }
                        </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroupItem>
                            <h2>Summary</h2>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col> Items</Col>
                                <Col> ${cart.itemsPrice}</Col>

                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col> Shipping</Col>
                                <Col> ${cart.shippingPrice}</Col>

                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col> Tax</Col>
                                <Col> ${cart.taxPrice}</Col>

                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col> Total</Col>
                                <Col> ${cart.totalPrice}</Col>

                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            {error && <Error variant="danger">{error}</Error>}
                        </ListGroupItem>
                        <ListGroupItem>
                            <Button
                                type='button'
                                className="btn-block"
                                disabled={cart.cartItems === 0}
                                onClick={handlePlaceOrder}>
                                Place Order
                            </Button>

                        </ListGroupItem>
                    </Card>
                </Col>
            </Row>

        </>
    )
}

export default PlaceOrderScreen