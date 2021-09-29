import React, { useState } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Form, List, Button, Segment, Label } from 'semantic-ui-react';
import { useStateValue, addDiagnosis } from '../state';
import { Diagnosis } from '../types/types';

interface SearchResults {
    terms: string | undefined,
    results: Array<{ name: string, desc: string }>,
    error?: string | undefined
}

interface ICDCodeLookupResult {
    /* returned when search by term */
    terms?: string,
    results?: Array<{ name: string, desc: string }>,
    /* returned when search by code */
    code?: { name: string, desc: string },
    to?: { codes: Array<{ name: string, desc: string }> }
    subcodes?: Array<{ name: string, desc: string }>
}

const SearchICDCode = () => {
    const [{ terms, results, error }, setResults] = useState<SearchResults>({ terms: undefined, results: [], error: undefined });
    const [fetching, setFetching] = useState<boolean>(false);
    const [added, setAdded] = useState<boolean[]>([]);
    const [{ diagnoses }, dispatch] = useStateValue();
    
    // used for debouncing icdcodelookup api calls
    let typingTimer: ReturnType<typeof setTimeout>;
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const doneTypingInterval = 450;

    const extractResults = (data: ICDCodeLookupResult): SearchResults => {
        if(data.terms) {
            return {
                results: data?.results?.map(({ name, desc }) => ({ name: name, desc: desc })) || [],
                terms: data.terms
            };
        }
        else if(data.code) {
            const rel = data.to
                ? data.to.codes.map(({ name, desc }: { name: string, desc: string }) => ({ name, desc}))
                : data.subcodes ? data.subcodes.map(({ name, desc }: { name: string, desc: string }) => ({ name, desc})) : [];
            return {
                results: [
                    { name: data.code.name, desc: data.code.desc },
                    ...rel
                ],
                terms: data.code.name
            };
        }
        else {
            return {
                terms: undefined,
                results: []
            };
        }
        /*else
            throw Error('Cannot parse ICD Code lookup results');*/
    };

    const updateResultsList = async (terms: string) => {
        if(terms) {
            document.getElementById('results-div')?.scrollTo(0, 0);
            try {
                setFetching(true);
                const { data: searchResultsFromApi } = await axios.post<SearchResults>(`${apiBaseUrl}/icdclookup`, { terms });
                setFetching(false);

                //console.log('extractResults', extractResults(searchResultsFromApi as any));
                const extracted = extractResults(searchResultsFromApi);
                
                /*setResults({
                    results: searchResultsFromApi?.results?.map(({ name, desc }) => ({ name, desc })) || [],
                    terms: searchResultsFromApi.terms || terms
                });*/
                setResults({
                    ...extracted,
                    terms: extracted.terms || terms
                });

                const existingDiagnoses = Object.keys(diagnoses);
                setAdded(
                    extracted.results 
                    ? extracted.results.map(({ name }) => existingDiagnoses.includes(name))
                    : []
                );
                
            }
            catch(error: any) {
                console.log(error);
                setResults({ results: [], terms: terms, error: error.message as string });
            }
        }
    };

    const addToDiagnoses = async (diagnosis: { name: string, desc: string }, index: number) => {
        try {
            await axios.post<Diagnosis>(`${apiBaseUrl}/diagnoses`, { code: diagnosis.name, name: diagnosis.desc });
            dispatch(addDiagnosis({ code: diagnosis.name, name: diagnosis.desc }));
            setAdded(added.map((a, i) => i !== index ? a : true));
        }
        catch(error: any) {
            setResults({ terms: terms, results: results, error: error.message as string });
        }
        
    };

    const onKeyUp = (_e: React.KeyboardEvent<HTMLInputElement>) => {
        // https://stackoverflow.com/questions/4220126/run-javascript-function-when-user-finishes-typing-instead-of-on-key-up
        clearTimeout(typingTimer);
        if(/^[a-z 0-9-]{1}$|Backspace/i.exec(_e.key)) { // key press was a-z, 0-9, - or (back)space
            if(inputRef.current?.value) {
                typingTimer = setTimeout(() => void updateResultsList(inputRef.current?.value || ''), doneTypingInterval);
            }
        }
    };

    return (
        <Form>
            <Form.Field>
                <label>search terms</label>
                <input
                    ref={inputRef}
                    type='text'
                    autoComplete="off"
                    id="search-term"
                    name="search-term"
                    //onChange={(e) => setTimeout(() => void updateResultsList(e.target.value.trim()), 1000)}
                    onKeyUp={e => onKeyUp(e)}
                />
            </Form.Field>
            <div
                id='results-div'
                style={{ minHeight: 'max-content', maxHeight: '50vh', overflow: 'auto' }}
                className={fetching ? 'ui segment loading' : undefined}
            >
                {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
                <List divided verticalAlign='middle'>
                    {
                        results.length > 0
                            ? results.map(({ name, desc }, i) =>
                                <List.Item key={`${name}_${i}`}>
                                    <List.Content floated='right'>
                                        <Button
                                            disabled={added[i]}
                                            onClick={() => { void addToDiagnoses({ name, desc }, i); }}
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
            </div>
            <div style={{ marginTop: '2vh' }}>
                <Label color='blue'>
                    powered by
                    <Label.Detail as='a'>
                        <span onClick={() => window.open('https://icdcodelookup.com', '_blank', 'noreferrer,noopener')}>
                            <em>icdcodelookup</em>
                        </span>
                    </Label.Detail>
                </Label>
            </div>
        </Form>
    );
};

export default SearchICDCode;