import { useEffect } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Row, Col } from "react-bootstrap";
import Error from "../components/Error";
import Loader from '../components/Loader';
import { listProducts } from "../actions/productActions";

const ProductListScreen = ({ history, match }) => {
    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);
    const { products, loading, error } = productList;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {

            dispatch(listProducts());
        } else {
            history.push("/login");
        }
    }, [userInfo, dispatch, history]);

    const handleDelete = (id) => {
        if (window.confirm("Are You sure?")) {

            //delete product 
        }
    }
    const handleCreateProduct = () => {
        console.log("create product");
    }
    return (
        <>
            <Row className="align-items-center">
                <Col >
                    <h1>Products</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={handleCreateProduct}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>

            {loading ? <Loader /> : error ? <Error variant="danger">{error}</Error> : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>

                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm m-2'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        variant='light'
                                        className='btn-sm m-2'
                                        onClick={() => handleDelete(product._id)}
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

export default ProductListScreen;