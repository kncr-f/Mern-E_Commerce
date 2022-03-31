import { useEffect } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import Error from "../components/Error";
import Loader from '../components/Loader';
import { listUsers, deleteUser } from "../actions/userActions";

const UserListScreen = ({ history }) => {
    const dispatch = useDispatch();

    const userList = useSelector(state => state.userList);
    const { users, loading, error } = userList;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector(state => state.userDelete);
    const { success: successDelete } = userDelete;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {

            dispatch(listUsers());
        } else {
            history.push("/login");
        }
    }, [userInfo, dispatch, history, successDelete]);

    const handleDelete = (id) => {
        if (window.confirm("Are You sure?")) {

            dispatch(deleteUser(id));
        }
    }

    return (
        <>
            <h1> Users</h1>
            {loading ? <Loader /> : error ? <Error variant="danger">{error}</Error> : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>{user.isAdmin ?
                                    (<i className='fas fa-check' style={{ color: "green" }}></i>) :
                                    (<i className='fas fa-times' style={{ color: "red" }}></i>)

                                }</td>

                                <td>
                                    <LinkContainer to={`/user/${user.id}/edit`}>
                                        <Button variant='dark' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </Table>
            )}

        </>
    )
}

export default UserListScreen;