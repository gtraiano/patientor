// knowledge on React generic components from https://stackoverflow.com/a/66052574

import React, { ReactElement, SyntheticEvent } from "react";
import { Icon, Table } from "semantic-ui-react";
import { Action } from "../../types/Action";

export interface GenericAction<T> extends Action {
    arg: keyof T,                   // object key to be used as argument in callback
    callback: (args: any) => void;  // callback function
}

interface GenericProps<T> {
    data: Array<
        T |
        { [key in keyof T]: any }
    >,                              // dataset
    header: Array<{                 // table fields
        key: keyof T,               // object key corresponding to field
        sortable: boolean,          // field is sortable
        alias?: string              // string to display in table header (default is key name with first character capitalised)
    }>,
    sortFunc: (key: keyof T|undefined, order: boolean|undefined) => (a: T, b: T) => number, // sort function
    actions?: Array<GenericAction<T>>,  // row actions (edit, delete, etc...)
}

const SortableTable = <T,>({ data, header, sortFunc, actions }: GenericProps<T>) => {
    // key = sort key, order = true for asc, false for desc, undefined for none
    const [sortBy, setSortBy] = React.useState<{ key: keyof T|undefined, order: boolean|undefined }>({ key: undefined, order: undefined });
    // sortable header click handler
    const changeSortKey = (e: SyntheticEvent, sortKey: keyof T|undefined) => {
        if(e.type === 'click') {
            setSortBy(v => ({ key: sortKey, order: !v.order ?? true }));
        }
        else if(e.type === 'contextmenu') {
            e.preventDefault();
            setSortBy({ key: undefined, order: undefined });
        }
    };

    const isTableCell = (el: any) => {
        return el
            ? ((el as ReactElement) as any).type?.name === 'TableCell' || ((el as ReactElement) as any).type?.displayName === 'TableCell' || (el as ReactElement).props?.as === 'td'
            : false;
    };

    if(!data || !data.length) return null;

    return (
        <Table celled>
            <Table.Header className='sticky-header'>
                <Table.Row>
                {header.map(({ key, sortable, alias }) =>
                    <Table.HeaderCell
                        key={key as string}
                        onClick={sortable ? (e: SyntheticEvent) => changeSortKey(e, key) : null}
                        onContextMenu={sortable ? (e: SyntheticEvent) => changeSortKey(e, key) : null}
                        style={{ cursor: sortable ? 'pointer' : 'hand' }}
                        singleLine
                    >
                        {alias ?? `${(key as string)[0].toLocaleUpperCase()}${(key as string).substring(1)}`}
                        {sortable &&
                        <Icon
                            name={!sortBy.order ? 'triangle down' : 'triangle up'}
                            style={{ opacity: sortBy.key === key ? (sortBy.key === undefined ? 0 : 1) : 0 }} // hide icon when not sorted by current key
                        />
                        }
                    </Table.HeaderCell>
                )}
                    {actions?.length && <Table.HeaderCell>Actions</Table.HeaderCell> /* actions field */}
                </Table.Row>
            </Table.Header>

            <Table.Body>
            {data
                .map(el => el).sort(sortFunc(sortBy.key, sortBy.order)) // sort copy of dataset so that we can revert back to the original dataset
                .map((el, i) => (
                    <Table.Row key={`row_${i}`}>
                        {header.map(({ key }, j) => isTableCell(el[key])
                            ? {...el[key], ...(!(el[key] as ReactElement).key && { key : `cell_${i}${j}` /* add element key if missing*/})}
                            : <Table.Cell key={`cell_${i}${j}`}>{el[key] ?? ''}</Table.Cell>
                        )}
                        {actions?.length &&
                        <Table.Cell singleLine>
                            <div>
                            {actions.map(a =>
                                <div
                                    key={`cell_${i}${header.length}_action_${a.label}`}
                                    style={{ display: 'inline-block', cursor: 'pointer' }}
                                    onClick={() => { a.callback(el[a.arg]); }}
                                >
                                    <Icon name={a.iconName} title={a.label}/>
                                </div>)
                            }
                            </div>
                        </Table.Cell>}
                    </Table.Row>
                    )
                )
            }
            </Table.Body>
        </Table>
    );
};

export default SortableTable;