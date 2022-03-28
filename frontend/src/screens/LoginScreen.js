import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Button } from "react-bootstrap";
import Error from "../components/Error";
import Loader from '../components/Loader';
import { login } from '../actions/userActions';
import FormContainer from '../components/FormContainer';

const LoginScreen = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const redirect = props.location.search ? props.location.search.split("=")[1] : "/";

    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo, loading, error } = userLogin;

    //if we already logged in redirect
    useEffect(() => {
        if (userInfo) {
            props.history.push(redirect)
        }
    }, [userInfo, redirect, props.history]);

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(login(email, password));
        //Login dispatch stuff goes here

    }

    return (


        <FormContainer>
            <h1>Sing In</h1>
            {error && <Error variant="danger">{error}</Error>}
            {loading && <Loader />}
            <Form onSubmit={handleSubmit}>
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

                <Button type='submit' variant='primary'>
                    Sign In
                </Button>

            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer?{" "}
                    <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}> Register</Link>
                </Col>
            </Row>

        </FormContainer>

    );


};

export default LoginScreen;