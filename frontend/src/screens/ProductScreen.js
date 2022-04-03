import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import Rating from "../components/Rating";
import { listProductDetails, createProductReview } from '../actions/productActions';
import Error from "../components/Error";
import Loader from "../components/Loader";
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import Meta from '../components/Meta';


const ProductScreen = ({ history, match }) => {
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");


    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, product, error } = productDetails;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const productReviewCreate = useSelector(state => state.productReviewCreate);
    const { success: successReviewCreate, error: errorReviewCreate } = productReviewCreate;


    useEffect(() => {
        if (successReviewCreate) {
            alert("Review Submitted!")
            setRating(0);
            setComment("");
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }

        dispatch(listProductDetails(match.params.id))

    }, [dispatch, match, successReviewCreate]);

    const handleAddToCart = () => {
        history.push(`/cart/${match.params.id}?quantity=${quantity}`)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createProductReview(match.params.id, { rating, comment }))
    }
    return (
        <>
            <Link className='btn btn-light my-3' to="/"> Go Back</Link>
            {loading ? <Loader /> : error ? <Error variant="info">{error}</Error> : (
                <>
                    <Meta title={product.name} />
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

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Quantity</Col>
                                                <Col>
                                                    <Form.Control
                                                        as="select"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(e.target.value)}>
                                                        {[...Array(product.countInStock).keys()].map((item) => (
                                                            <option key={item + 1} value={item + 1}>
                                                                {item + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>

                                            </Row>

                                        </ListGroup.Item>
                                    )}

                                    <ListGroupItem>
                                        <Button
                                            className='btn-block'
                                            type="button"
                                            disabled={product.countInStock === 0}
                                            onClick={handleAddToCart}
                                        >
                                            Add To Cart
                                        </Button>
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Error>No Reviews</Error>}
                            <ListGroup variant='flush'>
                                {product.reviews.map(item => (
                                    <ListGroupItem key={item._id}>
                                        <strong>
                                            {item.name}
                                        </strong>
                                        <Rating value={item.rating} />
                                        <p>{item.createdAt.substring(0, 10)}</p>
                                        <p>{item.comment}</p>
                                    </ListGroupItem>
                                ))}
                                <ListGroupItem>
                                    <h2>Write a Customer Review</h2>
                                    {errorReviewCreate && <Error variant="danger">{errorReviewCreate}</Error>}
                                    {userInfo ? (
                                        <Form onSubmit={handleSubmit}>
                                            <FormGroup controlId='rating'>
                                                <FormLabel> Rating</FormLabel>
                                                <FormControl
                                                    as="select"
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="1">1 - Poor</option>
                                                    <option value="2">2 - Fair</option>
                                                    <option value="3">3 - Good</option>
                                                    <option value="4">4 - Very Good</option>
                                                    <option value="5">5 - Excellent</option>
                                                </FormControl>
                                            </FormGroup>
                                            <FormGroup controlId='comment'>
                                                <FormLabel>Comment  </FormLabel>
                                                <FormControl
                                                    as="textarea"
                                                    value={comment}
                                                    row="3"
                                                    onChange={(e) => setComment(e.target.value)}>
                                                </FormControl>
                                            </FormGroup>
                                            <Button type='submit' variant='primary'>Submit</Button>

                                        </Form>
                                    ) :
                                        <Error>Please <Link to="/login">sign in</Link> to write a review</Error>}
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}

        </>
    )
}

export default ProductScreen