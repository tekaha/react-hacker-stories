import * as React from 'react';
import { sortBy } from 'lodash';

import { ReactComponent as Check } from './check.svg';

const SORTS = {
    NONE: (list) => list,
    TITLE: (list) => sortBy(list, 'title'),
    AUTHOR: (list) => sortBy(list, 'author'),
    COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
    POINT: (list) => sortBy(list, 'points').reverse(),
}

const List = ({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState({
        sortKey: 'NONE',
        isReverse: false
    });

    const handleSort = (sortKey) => {
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        setSort({ sortKey, isReverse });
    };

    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse
        ? sortFunction(list).reverse() 
        : sortFunction(list);

    return (
        <ul>
            <li style={{ display: 'flex' }}>
                <span style={{ width: '40%' }}>
                    <button type="button" onClick={() => handleSort('TITLE')}>
                        Title
                    </button>
                </span>
                <span style={{ width: '30%' }}>
                    <button type="button" onClick={() => handleSort('AUTHOR')}>
                        Author
                    </button>
                </span>
                <span style={{ width: '10%' }}>
                    <button type="button" onClick={() => handleSort('COMMENT')}>
                        Comments
                    </button>
                </span>
                <span style={{ width: '10%' }}>
                    <button type="button" onClick={() => handleSort('POINT')}>
                        Points
                    </button>
                </span>
                <span style={{ width: '10%' }}>Actions</span>
            </li>
            {sortedList.map((item) => (
                <Item
                    key={item.objectID}
                    item={item}
                    onRemoveItem={onRemoveItem}
                />
            ))}
        </ul>
    )
};

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

export { List };