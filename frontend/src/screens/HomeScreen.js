import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { listProducts } from "../actions/productActions";
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { Link } from 'react-router-dom';


const HomeScreen = ({ match }) => {
    const searchTerm = match.params.search;
    const pageNumber = match.params.pageNumber || 1;

    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);
    const { loading, error, products, currentPage, totalPagesNum } = productList;



    useEffect(() => {

        dispatch(listProducts(searchTerm, pageNumber))

    }, [dispatch, searchTerm, pageNumber]);




    return (
        <>
            <Meta />
            {!searchTerm ? <ProductCarousel /> : <Link to="/" className='btn btn-light' >Go Back</Link>}
            <h1>Latest products</h1>
            {loading ? <Loader />
                : error ? <Error variant="info">{error}</Error>
                    : (
                        <>
                            <Row>
                                {products.map((product) => (
                                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>

                                        <Product product={product} />

                                    </Col>

                                ))}
                            </Row>
                            <Paginate
                                totalPagesNum={totalPagesNum}
                                currentPage={currentPage}
                                searchTerm={searchTerm ? searchTerm : ""}
                            />
                        </>

                    )}

        </>
    )
}

export default HomeScreen