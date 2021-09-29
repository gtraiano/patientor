import axios from 'axios';
import React, { useEffect } from 'react';
import { Card, Icon, Table } from 'semantic-ui-react';
import { apiBaseUrl } from '../constants';
import { addDiagnosis, useStateValue } from '../state';
import { Action } from '../types/Action';
import { Diagnosis, Entry, EntryType, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../types/types';
import HealthRatingBar from './HealthRatingBar';

import '../styles/general.css';

interface Props {
    entry: Entry,
    actions: EntryAction[],
    onEdit?: (entry: Entry) => void,
    onDelete?: (entry: Entry) => void
}

export interface EntryAction extends Action {
    callback: (entry: Entry) => void;
}

const PatientEntryCard = ({ entry, actions }: Props) => {
    const [{ diagnoses }, dispatch] = useStateValue();
    
    const assertNever = (value: never): never => {
        throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
    };

    const allDiagnosisInfoAvailable = (): boolean => {
        return entry.diagnosisCodes
            ? entry.diagnosisCodes.reduce((acc: boolean, code) => acc && (diagnoses[code] !== undefined), true)
            : false;
    };

    const renderDiagnosesInfo = () => {
        if(!entry.diagnosisCodes || !entry.diagnosisCodes.length || !allDiagnosisInfoAvailable()) {
            return null;
        }
        return (
            <React.Fragment>
                <h4>Diagnosis</h4>
                {/*<ul>{entry.diagnosisCodes?.map((c,index) => <li key={index}>{Object.values(c).slice(0,2).join(' ')}</li>)}</ul>*/}
                {/*<ul>{entry.diagnosisCodes?.map((code, index) => <li key={index}>{code} {diagnoses[code].name}</li>)}</ul>*/}
                <Table collapsing compact singleLine={false} className="no-border no-padding-left medium-line-height">
                    <Table.Body as="ul">
                        {entry.diagnosisCodes?.map((code, index) =>
                            <Table.Row key={index}>
                                <Table.Cell as="li">{code}</Table.Cell>
                                <Table.Cell>{diagnoses[code].name}</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </React.Fragment>
        );
    };

    const HealthCheckEntryInfo = (entry: HealthCheckEntry) => {
        return (
            <>
                <h2>{entry.date} <Icon name="doctor" title="health check" /></h2>
                <p><em>{entry.description}</em></p>
                {/*<p>Examined by {entry.specialist}</p>
                <HealthRatingBar rating={entry.healthCheckRating} showText={true}/>*/}
                <Table collapsing compact singleLine={false} className="no-border no-padding-left medium-line-height">
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Specialist</Table.Cell>
                            <Table.Cell>{entry.specialist}</Table.Cell>
                        </Table.Row>
                        <Table.Row verticalAlign="top">
                            <Table.Cell>Health rating</Table.Cell>
                            <Table.Cell><HealthRatingBar rating={entry.healthCheckRating} showText={true} inlineText/></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                {renderDiagnosesInfo()}
            </>
        );
    };
    
    const OccupationalHealthcareEntryInfo = (entry: OccupationalHealthcareEntry) => {
        return (
            <>
                <h2>
                    {entry.date}&nbsp;
                    <Icon name="stethoscope" title="occupational healthcare" />&nbsp;
                    <span
                        style={{ padding: '4px', border: '1px solid', borderRadius: '4px', cursor: 'default' }}
                        title="employer">
                        {entry.employerName}
                    </span>
                </h2>
                <p><em>{entry.description}</em></p>
                {/*<p>Examined by {entry.specialist}</p>
                {entry.sickLeave && <p>Sick leave {entry.sickLeave?.startDate} &mdash; {entry.sickLeave?.endDate}</p>}*/}
                <Table collapsing compact singleLine={false} className="no-border no-padding-left medium-line-height">
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Specialist</Table.Cell>
                            <Table.Cell>{entry.specialist}</Table.Cell>
                        </Table.Row>
                        {entry.sickLeave &&
                            <Table.Row>
                                <Table.Cell>Sick leave</Table.Cell>
                                <Table.Cell>{entry.sickLeave?.startDate} &mdash; {entry.sickLeave?.endDate}</Table.Cell>
                            </Table.Row>
                        }
                    </Table.Body>
                </Table>
                {renderDiagnosesInfo()}
            </>
        );
    };
    
    const HospitalEntryInfo = (entry: HospitalEntry) => {
        return (
            <>
                <h2>{entry.date} <Icon name="hospital" title="hospital admission"/></h2>
                <p><em>{entry.description}</em></p>
                <Table collapsing compact singleLine={false} className="no-border no-padding-left medium-line-height">
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Specialist</Table.Cell>
                            <Table.Cell>{entry.specialist}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Discharged on</Table.Cell>
                            <Table.Cell>{entry.discharge.date}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Discharge criteria</Table.Cell>
                            <Table.Cell>{entry.discharge.criteria}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                {/*<p>Examined by {entry.specialist}</p>
                <p>Discharged on {entry.discharge.date} because &ldquo;<em>{entry.discharge.criteria}</em>&rdquo;</p>*/}
                {renderDiagnosesInfo()}
            </>
        );
    };

    const entryInfo = () => {
        switch (entry.type as string) {
            case EntryType.HealthCheckEntry:
               return HealthCheckEntryInfo(entry as HealthCheckEntry);
            case EntryType.HospitalEntry:
                return HospitalEntryInfo(entry as HospitalEntry);
            case EntryType.OccupationalHealthcareEntry:
                return OccupationalHealthcareEntryInfo(entry as OccupationalHealthcareEntry);
            default:
                return assertNever(entry.type as never);
        }
    };

    useEffect(() => {
        // fetch diagnosis info and add to state if necessary
        entry.diagnosisCodes?.forEach(code => {
            if(diagnoses[code] === undefined) {
                void axios
                    .get<Diagnosis>(`${apiBaseUrl}/diagnoses/${code}`)
                    .then(response => {
                        if(response.data) {
                            dispatch(addDiagnosis(response.data));
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    }, []);

    if(!entry) {
        return null;
    }

    return (
        <Card variant="outlined" fluid>
            <Card.Content>
                {entryInfo()}
                <div
                    style={{ display: 'inline-flex', width: 'max-content', position: 'absolute', top: '1.25rem', right: '.5rem', /*cursor: 'pointer'*/ }}
                >
                    {actions.map(a => 
                        <div key={`${a.label}`} onClick={() => a.callback(entry)} style={{ cursor: 'pointer' }}>
                            <Icon name={a.iconName} title={a.label} />
                        </div>
                    )}
                </div>
            </Card.Content>
        </Card>
    );
};

export default PatientEntryCard;