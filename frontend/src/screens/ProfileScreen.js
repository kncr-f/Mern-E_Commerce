import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Error from "../components/Error";
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { myListOrders } from '../actions/orderActions';


const ProfileScreen = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);


    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails);
    const { user, loading, error } = userDetails;

    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { success } = userUpdateProfile;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const orderMyList = useSelector(state => state.orderMyList);
    const { orders, loading: loadingOrders, error: errorOrders } = orderMyList;


    //if we already logged in redirect
    useEffect(() => {
        if (!userInfo) {
            props.history.push("/login");
        } else {
            if (!user || !user.name || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET });
                dispatch(getUserDetails("profile"));
                dispatch(myListOrders());
            } else {
                setName(user.name);
                setEmail(user.email);

            }
        }
    }, [user, userInfo, props.history, dispatch, success]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Password does not match!")
        } else {
            dispatch(updateUserProfile({ id: user._id, name, email, password }))
        }

    }

    return (

        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                {message && <Error variant="danger">{message}</Error>}
                { }
                {success && <Error variant="success">Profile Updated</Error>}
                {loading ? (<Loader />) : error ? (
                    <Error variant="danger">{error}</Error>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name </Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Type your name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}

                            >

                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Type your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}

                            >

                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Type your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}

                            >

                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='confirmPassword'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Confirm  password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}

                            >

                            </Form.Control>
                        </Form.Group>

                        <Button className='my-3' type='submit' variant='primary'>
                            Update
                        </Button>

                    </Form>
                )}


            </Col>
            <Col md={9}>
                <h2> My Orders</h2>
                {loadingOrders ? <Loader /> : errorOrders ? <Error variant="danger">
                    {errorOrders}
                </Error> : (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID </th>
                                <th>DATE </th>
                                <th>TOTAL </th>
                                <th>PAID </th>
                                <th>DELIVERED </th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.isPaid ? (order.paidAt.substring(0, 10)) : (
                                        <i className='fas fa-times' style={{ color: "red" }}></i>
                                    )}
                                    </td>
                                    <td>{order.isDelivered ? (order.deliveredAt.substring(0, 10)) : (
                                        <i className='fas fa-times' style={{ color: "red" }}></i>
                                    )}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className='btn-sm' variant='dark'> Details</Button>

                                        </LinkContainer>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )

                }

            </Col>
        </Row>




    );


};

export default ProfileScreen;