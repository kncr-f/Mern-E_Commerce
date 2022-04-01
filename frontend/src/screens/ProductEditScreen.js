import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import Error from "../components/Error";
import Loader from '../components/Loader';
import { listProductDetails } from '../actions/productActions';
import FormContainer from '../components/FormContainer';


const ProductEditScreen = ({ match, history }) => {

    const productId = match.params.id;

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");


    const dispatch = useDispatch();
    const productDetails = useSelector(state => state.productDetails);
    const { product, loading, error } = productDetails;


    useEffect(() => {

        if (!product.name || product._id !== productId) {
            dispatch(listProductDetails(productId))
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }




    }, [product, dispatch, productId, history]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //update product

    }

    return (
        <>
            <Link to="/admin/productlist" className='btn btn-light my-3'>Go Back</Link>
            <FormContainer>
                <h1>Edit Product</h1>

                {/* {loadingUpdate && <Loader />}
                {errorUpdate && <Error variant="danger">{errorUpdate}</Error>} */}


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

                            <Form.Group controlId='price'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Type your price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='image'>

                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Type image url'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                >

                                </Form.Control>

                            </Form.Group>

                            <Form.Group controlId='brand'>

                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Type Brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                >

                                </Form.Control>

                            </Form.Group>

                            <Form.Group controlId='countInStock'>
                                <Form.Label>Count In Stock</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Type countInStock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='category'>

                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Type Category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >

                                </Form.Control>

                            </Form.Group>

                            <Form.Group controlId='description'>

                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Type Description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                >

                                </Form.Control>

                            </Form.Group>

                            <Button className='my-3' type='submit' variant='primary'>
                                Update
                            </Button>

                        </Form>

                    )}

            </FormContainer>
        </>

    );


};

export default ProductEditScreen;