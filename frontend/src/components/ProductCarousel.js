import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Carousel, CarouselItem, Image } from 'react-bootstrap';
import Loader from './Loader';
import Error from './Error';
import { listTopProducts } from '../actions/productActions';


const ProductCarousel = () => {
    const dispatch = useDispatch();

    const productTopRated = useSelector(state => state.productTopRated);
    const { error, loading, products } = productTopRated;

    useEffect(() => {
        dispatch(listTopProducts())
    }, [dispatch]);

    return loading ? <Loader /> : error ? <Error variant="danger">{error}</Error> : (
        <Carousel
            pause="hover"
            className='bg-info'
        >
            {products.map(product => (
                <CarouselItem key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid />
                        <Carousel.Caption className='carousel-caption'>
                            <h2>{product.name} ({product.price})</h2>
                        </Carousel.Caption>
                    </Link>
                </CarouselItem>
            ))}
        </Carousel>
    )
}

export default ProductCarousel