import { useEffect, useState } from 'react';
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Card, ListGroupItem } from "react-bootstrap";
import axios from 'axios';
import Loader from '../components/Loader';
import React from 'react';
import Error from "../components/Error";
import { Link } from 'react-router-dom';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match }) => {
    const orderId = match.params.id;

    const [sdkReady, setSdkReady] = useState(false);

    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;
    //console.log("order.....", order)

    const orderPay = useSelector(state => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    if (!loading) {
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2);
        };

        order.itemsPrice = addDecimals(order.orderItems.reduce((add, item) => add + item.price * item.quantity, 0));

    }


    useEffect(() => {

        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get("/api/config/paypal");
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true)
            };
            document.body.appendChild(script);
        }



        if (!order || order._id !== orderId || successPay) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }

        }
    }, [dispatch, order, orderId, successPay])

    const handleSuccessPayment = (paymentResult) => {
        console.log('paymentResult', paymentResult);
        dispatch(payOrder(orderId, paymentResult))

    }


    return loading ? <Loader /> : error ?
        <Error variant="danger">{error}</Error> :
        <>
            <h1> Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {order.user.name}</p>
                            <p><strong> Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>
                                    Address: {" "}
                                </strong>
                                {order.shippingAddress.address} {order.shippingAddress.city}, {" "}
                                {order.shippingAddress.postalCode} {"-"} {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Error variant="success">Delivered on {order.deliveredAt}</Error>
                            ) : (<Error variant="danger">Not Delivered</Error>)
                            }
                        </ListGroupItem>

                        <ListGroupItem>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>
                                    Method:{" "}
                                </strong>
                                {order.paymentMethod}

                            </p>
                            {order.isPaid ? (
                                <Error variant="success">Paid on {order.paidAt}</Error>
                            ) : (<Error variant="danger">Not Paid</Error>)
                            }
                        </ListGroupItem>

                        <ListGroupItem>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Error>There is no Order yet</Error> :
                                (
                                    <ListGroup variant="flush">
                                        {order.orderItems.map((item, index) => (
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
                        <ListGroup variant="flush">
                            <ListGroupItem>
                                <h2>Order Summary</h2>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col> Items</Col>
                                    <Col> ${order.itemsPrice}</Col>

                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col> Shipping</Col>
                                    <Col> ${order.shippingPrice}</Col>

                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col> Tax</Col>
                                    <Col> ${order.taxPrice}</Col>

                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col> Total</Col>
                                    <Col> ${order.totalPrice}</Col>

                                </Row>
                            </ListGroupItem>
                            {!order.isPaid && (
                                <ListGroupItem>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? <Loader /> :
                                        (
                                            <PayPalButton
                                                amount={order.totalPrice}
                                                onSuccess={handleSuccessPayment}
                                            />
                                        )
                                    }
                                </ListGroupItem>
                            )}

                        </ListGroup>

                    </Card>
                </Col>
            </Row>
        </>
}

export default OrderScreen;