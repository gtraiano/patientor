import React, { useEffect } from 'react';
import { Card, Icon, SemanticICONS, Table } from 'semantic-ui-react';
import { useStateValue } from '../state';
import { Action } from '../types/Action';
import { Entry, EntryType, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../types/types';
import HealthRatingBar from './HealthRatingBar';

import '../styles/general.css';
import { addDiagnosis } from '../state/actions';
import { getDiagnosis } from '../controllers';

interface Props {
    entry: Entry,
    actions: EntryAction[],
    onEdit?: (entry: Entry) => void,
    onDelete?: (entry: Entry) => void
}

export interface EntryAction extends Action {
    callback: (entry: Entry) => void;
}

export const EntryIcon: { [key: string]: SemanticICONS } = {
    [EntryType.HospitalEntry]: 'hospital',
    [EntryType.HealthCheckEntry]: 'doctor',
    [EntryType.OccupationalHealthcareEntry]: 'stethoscope'
};

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
                <Table collapsing compact singleLine={false} className="no-border no-padding-left medium-line-height">
                    <Table.Body>
                        {entry.diagnosisCodes?.map((code, index) =>
                            <Table.Row key={index}>
                                <Table.Cell style={{ paddingTop: '.3em' }}><Icon fitted name="circle" size="tiny"/></Table.Cell>
                                <Table.Cell>{code}</Table.Cell>
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
                <h2>{entry.date} <Icon name={EntryIcon[entry.type]} title="health check" /></h2>
                <p><em>{entry.description}</em></p>
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
                    <Icon name={EntryIcon[entry.type]} title="occupational healthcare" />&nbsp;
                    <span
                        style={{ padding: '4px', border: '1px solid', borderRadius: '4px', cursor: 'default' }}
                        title="employer">
                        {entry.employerName}
                    </span>
                </h2>
                <p><em>{entry.description}</em></p>
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
                <h2>{entry.date} <Icon name={EntryIcon[entry.type]} title="hospital admission"/></h2>
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
                getDiagnosis(code)
                    .then(data => { data && dispatch(addDiagnosis(data)); })
                    .catch()
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