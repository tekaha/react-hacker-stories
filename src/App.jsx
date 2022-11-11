import * as React from 'react';
import axios from 'axios';

import './App.css';

import { ReactComponent as Check } from './check.svg';

const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true
            };
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter(
                    (story) => action.payload.objectID !== story.objectID
                )
            }
        default:
            throw new Error();
    }
};

const useStorageState = (key, initialState) => {
    const isMounted = React.useRef(false);

    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            console.log('A');
            localStorage.setItem(key, value);
        }
    }, [value, key]);

    return [value, setValue];
};

const getSumComments = (stories) => {
    console.log('C');

    return stories.data.reduce(
        (result, value) => result + value.num_comments,
        0
    );
}

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {

    const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

    const [url, setUrl] = React.useState(
        `${API_ENDPOINT}${searchTerm}`
    );

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        { data: [], isLoading: false, isError: false }
    );

    const handleFetchStories = React.useCallback(async () => {
        if (!searchTerm) return;

        dispatchStories({ type: 'STORIES_FETCH_INIT' });

        try {
            const result = await axios.get(url);

            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE ' })
        }


    }, [url]);

    React.useEffect(() => {
        console.log('How many times do I log?');
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = React.useCallback((item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item
        });
    }, []);

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);

        event.preventDefault();
    }

    console.log('B:App');

    const sumComments = React.useMemo(
        () => getSumComments(stories),
        [stories]
    );

    return (
        <div className="container">
            <h1 className="headline-primary">My Hacker Stories with {sumComments} comments.</h1>

            <SearchForm
                searchTerm={searchTerm}
                onSearchInput={handleSearchInput}
                onSearchSubmit={handleSearchSubmit}
            />

            {stories.isError && <p>Something went wrong ...</p>}

            {stories.isLoading ? (
                <p>Loading ...</p>
            ) : (
                    <List
                        list={stories.data}
                        onRemoveItem={handleRemoveStory}
                    />
                )}

        </div>
    )
}

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

const InputWithLabel = ({
    id,
    value,
    type = "text",
    onInputChange,
    isFocused,
    children
}) => (
    <>
        <label className="label" htmlFor={id}>{children}</label>
        &nbsp;
        <input
            className="input"
            id={id}
            type={type}
            value={value}
            autoFocus={isFocused}
            onChange={onInputChange}
        />
    </>
)

const List = React.memo(
    ({ list, onRemoveItem }) =>
        console.log('B:List') || (
            <ul>
                {list.map((item) => (
                    <Item
                        key={item.objectID}
                        item={item}
                        onRemoveItem={onRemoveItem}
                    />
                ))}
            </ul>
        )
)

const Item = ({ item, onRemoveItem }) => {

    return (
        <li className="item">
            <span style={{ width: '40%' }}>
                <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '10%' }}>{item.num_comments}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span style={{ width: '10%' }}>
                <button
                    className="button button_small"
                    type="button"
                    onClick={() => onRemoveItem(item)}
                >
                    <Check height="18px" width="18px" />
                </button>
            </span>
        </li>
    )
};

export default App;