import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem } from "react-bootstrap";
import Rating from "../components/Rating";
import { listProductDetails } from '../actions/productActions';
import Error from "../components/Error";
import Loader from "../components/Loader";




const ProductScreen = ({ match }) => {

    const dispatch = useDispatch();
    const productDetails = useSelector(state => state.productDetails);
    const { loading, product, error } = productDetails


    useEffect(() => {

        dispatch(listProductDetails(match.params.id))

    }, [dispatch, match]);


    return (
        <>
            <Link className='btn btn-light my-3' to="/"> Go Back</Link>
            {loading ? <Loader /> : error ? <Error variant="info">{error}</Error> : (

                <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid></Image>
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroupItem>
                                <h3>{product.name}</h3>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Rating
                                    value={product.rating}
                                    text={`${product.numReviews} reviews`}
                                />

                            </ListGroupItem>
                            <ListGroupItem>
                                Price: ${product.price}

                            </ListGroupItem>
                            <ListGroupItem>
                                Description: {product.description}

                            </ListGroupItem>
                        </ListGroup>

                    </Col>

                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroupItem>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col><strong>${product.price}</strong></Col>
                                    </Row>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>{product.countInStock > 0 ? "In Stock" : "Out Of Stock"}</Col>
                                    </Row>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <Button className='btn-block' type="button" disabled={product.countInStock === 0}>
                                        Add To Cart
                                    </Button>
                                </ListGroupItem>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>

            )}

        </>
    )
}

export default ProductScreen