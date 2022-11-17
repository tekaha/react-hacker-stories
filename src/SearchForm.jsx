import * as React from 'react';

import { InputWithLabel } from './InputWithLabel';

const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit
}) => (
    <form className="search-form" onSubmit={onSearchSubmit}>
        <InputWithLabel
            id="search"
            value={searchTerm}
            onInputChange={onSearchInput}
        >
            <strong>Search:</strong>
        </InputWithLabel>

        <button
            className="button button_large"
            type="submit"
            disabled={!searchTerm}
        >
            Submit
                </button>
    </form>
)

export { SearchForm };