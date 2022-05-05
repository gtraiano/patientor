import React, { useState } from 'react';

import { postDiagnosis, postICDCLookup } from '../../controllers';
import { useStateValue } from '../../state';
import { addDiagnosis } from '../../state/actions';

import { Form, Segment, Label, SearchResults } from 'semantic-ui-react';
import SearchResultsList from './SearchResultsList';


export interface SearchResults {
    terms: string | undefined,
    results: Array<{ name: string, desc: string }>,
    error?: string | undefined
}

interface ICDCodeLookupResults {
    /* returned when searching by term */
    terms?: string,
    results?: Array<{ name: string, desc: string }>,
    /* returned when searching by code */
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
    const doneTypingInterval = 750;

    const extractResults = (data: ICDCodeLookupResults): SearchResults => {
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
    };

    const updateResultsList = async (terms: string) => {
        if(terms) {
            document.getElementById('results-div')?.scrollTo(0, 0);
            try {
                setFetching(true);
                const data = await postICDCLookup(terms);
                setFetching(false);

                const extracted = extractResults(data);
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
                setFetching(false);
            }
        }
    };

    const addToDiagnoses = async (diagnosis: { name: string, desc: string }, index: number) => {
        try {
            await postDiagnosis({ code: diagnosis.name, name: diagnosis.desc });
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
                    onKeyUp={e => onKeyUp(e)}
                />
            </Form.Field>
            <div
                id='results-div'
                style={{ minHeight: '10vh', maxHeight: '50vh', overflow: 'auto' }}
                className={fetching ? 'ui segment loading' : undefined}
            >
                {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
                <SearchResultsList
                    results={{terms, results}}
                    onAdd={addToDiagnoses}
                    added={added}
                />
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