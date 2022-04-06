import { useState } from 'react';
import { Form, Button, FormControl } from "react-bootstrap";


const SearchBox = ({ history }) => {
    const [search, setSearch] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(search)
        if (search.trim()) {

            history.push(`/search/${search}`);
            setSearch("")
        } else {
            history.push("/");
        }

    }
    return (
        <Form onSubmit={handleSubmit} className='d-flex m-2'>

            <FormControl
                type='text'
                name="q"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Products"
                className='mx-sm-2 ml-sm-5'
                value={search}
            ></FormControl>

            <Button type='submit' variant='outline-success' className='p-2'>
                Search
            </Button>
        </Form>
    );
};

export default SearchBox;