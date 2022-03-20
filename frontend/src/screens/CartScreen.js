import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Error from '../components/Error';
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem } from "react-bootstrap";
import { addCartItem } from '../actions/cartActions';

const CartScreen = ({ match, location, history }) => {

    const productId = match.params.id;
    const quantity = location.search ? Number(location.search.split("=")[1]) : 1;

    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    console.log(cartItems)

    useEffect(() => {
        if (productId) {

            dispatch(addCartItem(productId, quantity))
        }

    }, [dispatch, productId, quantity])


    const handleRemoveFromCart = (id) => {
        console.log("remove");
    }

    const handleCheckOut = () => {
        history.push("/login?redirect=shipping")
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? <Error>Your cart is empty <Link to="/"></Link></Error> : (
                    <ListGroup variant='flush'>
                        {cartItems.map(item => (
                            <ListGroupItem key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                        ${item.price}
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            as="select"
                                            value={item.quantity}
                                            onChange={(e) => dispatch(addCartItem(item.product, Number(e.target.value)))}>
                                            {[...Array(item.countInStock).keys()].map((xx) => (
                                                <option key={xx + 1} value={xx + 1}>
                                                    {xx + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button
                                            type='button'
                                            variant="light"
                                            onClick={() => handleRemoveFromCart(item.product)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>

                            </ListGroupItem>
                        ))}
                    </ListGroup>

                )}

            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <h2>SUBTOTAL ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}) ITEMS</h2>
                            ${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}
                        </ListGroupItem>
                        <ListGroupItem>
                            <Button
                                variant='dark'
                                type='button'
                                className='m-auto'
                                disable={cartItems.length === 0}
                                onClick={handleCheckOut}>
                                Proceed To Checkout
                            </Button>

                        </ListGroupItem>
                    </ListGroup>
                </Card>

            </Col>

        </Row>
    )
}

export default CartScreen;