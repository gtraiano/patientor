import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { addPatient, removePatient, useStateValue } from "../state";
import { Gender, Patient, EntryType, Entry, HealthCheckRating } from "../types/types";
import { apiBaseUrl } from "../constants";
import { Button, CardGroup, Confirm, ConfirmProps, Icon, Table } from "semantic-ui-react";
import PatientEntryCard, { EntryAction } from "../components/PatientEntryCard";
import AddPatientEntry from "../AddPatientEntryModal";
import { EntryFormValues } from "../AddPatientEntryModal/AddEntryForm";
import { Action } from "../types/Action";
import AddPatientModal from "../AddPatientModal";
import { PatientFormValues } from "../AddPatientModal/AddPatientForm";
import { useHistory } from "react-router-dom";

import '../styles/general.css';

interface PatientAction extends Action {
    callback: (patient: Patient) => void
}

const PatientInfo = () => {
    const { id: patientId } = useParams<{ id: string }>();
    const [{ patients }, dispatch] = useStateValue();
    
    const [entryModalOpen, setEntryModalOpen] = React.useState<boolean>(false);
    const [patientModalOpen, setPatientModalOpen] = React.useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();
    
    const specialEntryKeys = ['patientId', 'healthCheckRating', 'discharge', 'employerName', 'sickLeave'];
    const [initialValues, setInitialValues] = useState<EntryFormValues | PatientFormValues | undefined>(undefined);
    const [confirm, setConfirm] = useState<ConfirmProps>({}); // confirmation modal props
    const history = useHistory();
    
    const entryActions: EntryAction[] = [
        { label: 'edit', iconName: 'edit', callback: (entry) => onEditEntry ? void onEditEntry(entry) : undefined },
        {
            label: 'delete',
            iconName: 'trash',
            callback: (entry) => openConfirm(
                entry.description,
                `Delete entry for ${entry.date}?`,
                () => {
                    void onDeleteEntry(entry);
                    closeConfirm();
                }
            )
        }
    ];
    const patientActions: PatientAction[] = [
        { label: 'edit', iconName: 'edit', callback: (patient) => void onEditPatient(patient) },
        {
            label: 'delete',
            iconName: 'trash',
            callback: (patient) => openConfirm(
                `Born on ${patient.dateOfBirth}, SSN ${patient.ssn}`,
                `Delete patient entry for ${patient.name}?`,
                () => {
                    void onDeletePatient(patient.id);
                    closeConfirm();
                    history.push('/');
                }
            )
        }
    ];

    const openEntryModal = (): void => {
        setEntryModalOpen(true);
    };

    const closeEntryModal = (): void => {
        setEntryModalOpen(false);
        setInitialValues(undefined);
        setError(undefined);
    };

    const openPatientModal = (): void => {
        setPatientModalOpen(true);
    };

    const closePatientModal = (): void => {
        setPatientModalOpen(false);
        setInitialValues(undefined);
        setError(undefined);
    };

    const closeConfirm = (): void => {
        setConfirm({
            ...confirm,
            open: false,
            content: ''
        });
      };
    
    const openConfirm = (message: string, header: string | null | undefined, onConfirm?: () => void, onCancel?: () => void): void => {
        setConfirm({
            //...confirm,
            header: header,
            content: message,
            open: true,
            /*...onConfirm && { onConfirm: onConfirm },
            ...onCancel && { onCancel: onCancel }*/
            onConfirm: onConfirm || confirm.onConfirm,
            onCancel: onCancel || closeConfirm
        });
    };

    const renderPatientEntries = () => {
        return (
            <React.Fragment>
                <h3>entries</h3>                
                {patients[patientId].entries && patients[patientId].entries.length > 0

                    ? <CardGroup>
                        {patients[patientId].entries.map(entry =>
                            <PatientEntryCard key={entry.id} entry={entry} actions={entryActions} onEdit={onEditEntry} onDelete={onDeleteEntry} />
                        )}
                    </CardGroup>

                    : <em>no entries</em>
                }
            </React.Fragment>
        );
    };

    const onSubmitEntry = async (values: EntryFormValues) => {
        let newEntry = Object.fromEntries(Object.entries(values).filter(([key, ]) => !specialEntryKeys.includes(key)));

        switch(values.type) {
            case EntryType.HealthCheckEntry:
                newEntry = {
                    ...newEntry,
                    //...(values.healthCheckRating !== undefined && { healthCheckRating: values.healthCheckRating })
                    healthCheckRating: values.healthCheckRating as HealthCheckRating
                };
                break;
            case EntryType.HospitalEntry:
                newEntry = {
                    ...newEntry,
                    ...values.discharge && { discharge: values.discharge }
                };
                break;
            case EntryType.OccupationalHealthcareEntry:
                newEntry = {
                    ...newEntry,
                    ...values.employerName && {employerName: values.employerName},
                    ...(values.sickLeave && values.sickLeave.startDate !== '' && values.sickLeave.endDate !== '' && { sickLeave: values.sickLeave })
                };
                break;
            default:
                break;
        }

        try {
            let response;
            if(initialValues && values.id) { // edit existing entry
                response = await axios.put<Patient>(`${apiBaseUrl}/patients/${patientId}/entries/${values.id}`, { id: values.id, ...newEntry });
            }
            else { // post new entry
                response = await axios.post<Patient>(`${apiBaseUrl}/patients/${patientId}/entries`, newEntry);
                
            }
            dispatch(addPatient(response.data));
            closeEntryModal();
            //history.back();
        }
        catch(error: any) {
            console.error(error);
            setError(error.response.data.error);
        }
    };

    const onEditEntry = (entry: Entry) => {
        setInitialValues(entry);
        openEntryModal();
    };

    const onDeleteEntry = async (entry: Entry) => {
        try {
            const { data: patient } = await axios.delete<Patient>(`${apiBaseUrl}/patients/${patientId}/entries/${entry.id}`);
            dispatch(addPatient(patient));
        }
        catch(error) {
            console.log(error);
        }
    };

    const onSubmitPatient = async (patient: PatientFormValues) => {
        try {
            const { data: submittedPatient } = await axios.put<Patient>(
                `${apiBaseUrl}/patients/${patientId}`,
                Object.fromEntries(Object.entries(patient).filter(([key,]) => !['id', 'entries'].includes(key)))
            );
            dispatch(addPatient(submittedPatient));
            closePatientModal();
        }
        catch(error: any) {
            console.log(error.response.data);
            setError(error.response.data.error);
        }
    };

    const onEditPatient = (patient: Patient) => {
        setInitialValues(patient);
        openPatientModal();
    };

    const onDeletePatient = async (id: string) => {
        try {
            await axios.delete(`${apiBaseUrl}/patients/${id}`);
            dispatch(removePatient(id));
        }
        catch(error: any) {
            console.log(error.response.data);
            setError(error.response.data.error);
        }
    };

    useEffect(() => {
        const fetchPatientInfo = async (): Promise<Patient | undefined> => {
            try {
                const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${patientId}`);
                return data;
            }
            catch(error) {
                console.error(`Patient id ${patientId} does not exist`);
            }
        };

        if(!patients[patientId] || !patients[patientId].entries) {
            void fetchPatientInfo().then(data => {
                dispatch(addPatient(data as Patient));
            });
        }
        //setConfirm({ ...confirm, onCancel: closeConfirm });
    }, []);

    if(patients[patientId] === null) {
        return null;
    }

    if(patients[patientId] === undefined) {
        return (
            <div>
                <h2>Patient id {patientId} does not exist!</h2>
            </div>
        );
    }

    return (
        <div>
            <div>
                <div style={{ display: 'inline-flex', justifyContent: 'flex-end', position: 'relative', width: '100%', top: '2.15rem' }}>
                    { 
                        patientActions.map(a =>
                            <div
                                key={`patient_action_${a.label}`}
                                style={{ cursor: 'pointer' }}
                                title={a.label}
                                onClick={() => a.callback(patients[patientId])}
                            >
                                <Icon name={a.iconName} />
                            </div>
                        )
                    }
                </div>
                <div>
                    <h2>{patients[patientId].name}&nbsp;
                        <Icon
                            name={patients[patientId].gender === Gender.Other
                                ? 'genderless'
                                : patients[patientId].gender === Gender.Male ? 'mars' : 'venus'
                            }
                        />
                    </h2>
                    {/*<p>
                        ssn: {patients[patientId].ssn}<br/>
                        occupation: {patients[patientId].occupation}<br/>
                        date of birth: {patients[patientId].dateOfBirth}
                    </p>*/}
                    <Table collapsing compact singleLine className="no-border no-padding-left low-line-height">
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>SSN</Table.Cell>
                                <Table.Cell>{patients[patientId].ssn}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Occupation</Table.Cell>
                                <Table.Cell>{patients[patientId].occupation}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Date of birth</Table.Cell>
                                <Table.Cell>{patients[patientId].dateOfBirth}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <div>
                <div style={{ position: 'relative', width: 'max-content', left: '91%', top: '2.15rem' }}>
                    <Button
                        as="a"
                        onClick={() => openEntryModal()}
                    >
                        add entry
                    </Button>
                    </div>
                <div>{renderPatientEntries()}</div>
            </div>
            <AddPatientEntry modalOpen={entryModalOpen} onSubmit={onSubmitEntry} onClose={closeEntryModal} initialValues={initialValues as EntryFormValues} />
            <AddPatientModal modalOpen={patientModalOpen} onSubmit={onSubmitPatient} onClose={closePatientModal} error={error} initialValues={initialValues as PatientFormValues} />
            <Confirm {...confirm} />
        </div>
        
    );
};

export default PatientInfo;