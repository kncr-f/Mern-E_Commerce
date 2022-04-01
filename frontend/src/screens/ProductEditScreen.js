import { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import Error from "../components/Error";
import Loader from '../components/Loader';
import { listProductDetails, updateProduct } from '../actions/productActions';
import FormContainer from '../components/FormContainer';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';


const ProductEditScreen = ({ match, history }) => {

    const productId = match.params.id;

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);


    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { product, loading, error } = productDetails;

    const productUpdate = useSelector(state => state.productUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = productUpdate;


    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            history.push("/admin/productlist")
        } else {
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

        }
    }, [product, dispatch, productId, history, successUpdate]);


    const handleUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        setUploading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"

                }
            }
            const { data } = await axios.post("/api/upload", formData, config);

            setImage(data);
            setUploading(false);
        } catch (error) {
            console.log(error)
            setUploading(false);

        }

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProduct({ _id: productId, name, price, image, brand, category, countInStock, description }))

    }

    return (
        <>
            <Link to="/admin/productlist" className='btn btn-light my-3'>Go Back</Link>
            <FormContainer>
                <h1>Edit Product</h1>

                {loadingUpdate && <Loader />}
                {errorUpdate && <Error variant="danger">{errorUpdate}</Error>}


                {loading ? <Loader /> : error ? <Error variant="danger"> {error}</Error> :
                    (
                        <Form onSubmit={handleSubmit}>

                            <Form.Group id='name'>
                                <Form.Label>Name </Form.Label>
                                <Form.Control
                                    type='name'
                                    placeholder='Type your name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}

                                >

                                </Form.Control>
                            </Form.Group>

                            <Form.Group id='price'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Type your price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group id='image'>

                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Type image url'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                >
                                </Form.Control>

                                <Form.Control
                                    type="file"
                                    id="image-file"
                                    label="Choose File"
                                    onChange={handleUpload}>

                                </Form.Control>
                                {uploading && <Loader />}

                            </Form.Group>

                            <Form.Group id='brand'>

                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Type Brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                >

                                </Form.Control>

                            </Form.Group>

                            <Form.Group id='countInStock'>
                                <Form.Label>Count In Stock</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Type countInStock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group id='category'>

                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Type Category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >

                                </Form.Control>

                            </Form.Group>

                            <Form.Group id='description'>

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