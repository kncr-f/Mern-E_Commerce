import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Button } from "react-bootstrap";
import Error from "../components/Error";
import Loader from '../components/Loader';
import { register } from '../actions/userActions';
import FormContainer from '../components/FormContainer';

const RegisterScreen = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const redirect = props.location.search ? props.location.search.split("=")[1] : "/";

    const dispatch = useDispatch();
    const userRegister = useSelector(state => state.userRegister);
    const { userInfo, loading, error } = userRegister;

    //if we already logged in redirect
    useEffect(() => {
        if (userInfo) {
            props.history.push(redirect)
        }
    }, [userInfo, redirect, props.history]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //Register dispatch 
        if (password !== confirmPassword) {
            setMessage("Password does not match!")
        } else {
            dispatch(register(name, email, password))
        }

    }

    return (


        <FormContainer>
            <h1>Register</h1>
            {message && <Error variant="danger">{message}</Error>}
            {error && <Error variant="danger">{error}</Error>}
            {loading && <Loader />}
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
                    Register
                </Button>

            </Form>

            <Row className='py-3'>
                <Col>
                    Have an account?{" "}
                    <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}> Login</Link>
                </Col>
            </Row>

        </FormContainer>

    );


};

export default RegisterScreen;