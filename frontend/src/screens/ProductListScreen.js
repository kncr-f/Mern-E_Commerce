import { useEffect } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Row, Col } from "react-bootstrap";
import Error from "../components/Error";
import Loader from '../components/Loader';
import { listProducts, deleteProduct, createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import Paginate from '../components/Paginate';

const ProductListScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber || 1;

    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);
    const { products, loading, error, currentPage, totalPagesNum } = productList;

    const productDelete = useSelector(state => state.productDelete);
    const { success: successDelete, loading: loadingDelete, error: errorDelete } = productDelete;

    const productCreate = useSelector(state => state.productCreate);
    const {
        success: successCreate,
        loading: loadingCreate,
        error: errorCreate,
        product: createdProduct
    } = productCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;


    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET });

        // if (!userInfo.isAdmin ?? !userInfo) {
        //     history.push("/login");
        // }

        if (!userInfo?.isAdmin) {
            history.push("/login");
        }
        if (successCreate) {
            history.push(`/admin/product/${createdProduct._id}/edit`)
        } else {
            dispatch(listProducts("", pageNumber));
        }
    }, [
        userInfo,
        dispatch,
        history,
        successDelete,
        successCreate,
        createdProduct,
        pageNumber]);

    const handleDelete = (id) => {
        if (window.confirm("Are You sure?")) {
            dispatch(deleteProduct(id));

        }
    };

    const handleCreateProduct = () => {
        dispatch(createProduct());
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
            {loadingDelete && <Loader />}
            {errorDelete && <Error variant="danger">{errorDelete}</Error>}

            {loadingCreate && <Loader />}
            {errorCreate && <Error variant="danger">{errorCreate}</Error>}

            {loading ? <Loader /> : error ? <Error variant="danger">{error}</Error> : (
                <>
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
                    <Paginate
                        totalPagesNum={totalPagesNum}
                        currentPage={currentPage}
                        isAdmin={true}

                    />
                </>
            )}

        </>
    )
}

export default ProductListScreen;