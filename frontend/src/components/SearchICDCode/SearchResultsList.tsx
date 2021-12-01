import React from "react";
import { List, Button } from "semantic-ui-react";
import { SearchResults } from ".";

interface ISearchResultsList {
    results: SearchResults;
    onAdd: (result: { name: string, desc: string }, i: number) => void;
    added: Array<boolean>;
}
const SearchResultsList = ( { results: { terms, results }, onAdd, added }: ISearchResultsList) => {
    return (
        <List divided verticalAlign='middle'>
        {
            results.length > 0
                ? results.map(({ name, desc }, i) =>
                    <List.Item key={`${name}_${i}`}>
                        <List.Content floated='right'>
                            <Button
                                disabled={added[i]}
                                onClick={() => { void onAdd({ name, desc }, i); }}
                            >
                                Add
                            </Button>
                        </List.Content>
                        <List.Header>{name}</List.Header>
                        <List.Description><span>{desc}</span></List.Description>
                    </List.Item>
                )
                : terms !== undefined ? `no results for "${terms}"` : null
        }
        </List>
    );
};

export default SearchResultsList;