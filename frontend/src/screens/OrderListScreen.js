import { useEffect } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import Error from "../components/Error";
import Loader from '../components/Loader';
import { listOrders } from "../actions/orderActions";

const OrderListScreen = ({ history }) => {
    const dispatch = useDispatch();

    const orderList = useSelector(state => state.orderList);
    const { orders, loading, error } = orderList;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {

            dispatch(listOrders());
        } else {
            history.push("/login");
        }
    }, [userInfo, dispatch, history]);



    return (
        <>

            <h1> Orders</h1>
            {loading ? <Loader /> : error ? <Error variant="danger">{error}</Error> : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)} </td>
                                <td>${order.totalPrice} </td>
                                <td>{order.isPaid ?
                                    (order.paidAt.substring(0, 10)) :
                                    (<i className='fas fa-times' style={{ color: "red" }}></i>)}
                                </td>
                                <td>{order.isDelivered ?
                                    (order.deliveredAt.substring(0, 10)) :
                                    (<i className='fas fa-times' style={{ color: "red" }}></i>)}
                                </td>

                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant='light' className='btn-sm m-2'>
                                            Details
                                        </Button>
                                    </LinkContainer>

                                </td>

                            </tr>
                        ))}
                    </tbody>

                </Table>
            )}

        </>
    )
}

export default OrderListScreen;