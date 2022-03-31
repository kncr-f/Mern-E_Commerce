import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import Error from "../components/Error";
import Loader from '../components/Loader';
import { getUserDetails } from '../actions/userActions';
import FormContainer from '../components/FormContainer';

const UserEditScreen = ({ match, history }) => {

    const userId = match.params.id;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);



    const dispatch = useDispatch();
    const userDetails = useSelector(state => state.userDetails);
    const { user, loading, error } = userDetails;

    //if we already logged in redirect
    useEffect(() => {

        if (!user.name || user._id !== userId) {
            dispatch(getUserDetails(userId))
        } else {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }

    }, [user, dispatch, userId]);

    const handleSubmit = (e) => {
        e.preventDefault();


    }

    return (
        <>
            <Link to="/admin/userlist" className='btn btn-light my-3'>Go Back</Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loading ? <Loader /> : error ? <Error variant="danger"> {error}</Error> :
                    (
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
                            <Form.Group controlId='isAdmin'>

                                <Form.Check
                                    type='checkbox'
                                    label='Is Admin'

                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                ></Form.Check>

                            </Form.Group>



                            <Button type='submit' variant='primary'>
                                Update
                            </Button>

                        </Form>

                    )}

            </FormContainer>
        </>




    );


};

export default UserEditScreen;