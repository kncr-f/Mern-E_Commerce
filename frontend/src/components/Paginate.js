import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ currentPage, totalPagesNum, isAdmin = false, searchTerm = "" }) => {
    return totalPagesNum > 1 && (
        <Pagination>
            {[...Array(totalPagesNum).keys()].map(page => (
                <LinkContainer
                    key={page + 1}
                    to={!isAdmin ? searchTerm ? `/search/${searchTerm}/page/${page + 1}` :
                        `/page/${page + 1}` : `/admin/productlist/${page + 1}`}>
                    <Pagination.Item active={page + 1 === currentPage}>
                        {page + 1}
                    </Pagination.Item>
                </LinkContainer>
            ))}
        </Pagination>
    )

}

export default Paginate