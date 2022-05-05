import React, { useEffect, useState } from "react";
import axios, { deletePatient, deletePatientEntry, postPatientEntry, putPatient, putPatientEntry } from "../../controllers";
import { useParams } from "react-router";
import { useStateValue } from "../../state";
import { Gender, Patient, EntryType, Entry } from "../../types/types";
import { Button, CardGroup, Confirm, ConfirmProps, DropdownProps, Icon, Loader, Select, Table } from "semantic-ui-react";
import PatientEntryCard, { EntryAction } from "../PatientEntryCard";
import AddPatientEntry from "../AddPatientEntryModal";
import { EntryFormValues } from "../AddPatientEntryModal/AddEntryForm";
import { Action } from "../../types/Action";
import AddPatientModal from "../AddPatientModal";
import { PatientFormValues } from "../AddPatientModal/AddPatientForm";
import { useHistory } from "react-router-dom";
import { addPatient, removePatient } from "../../state/actions";
import { getPatient } from "../../controllers";
import HealthRatingBar from "../HealthRatingBar";

import '../../styles/general.css';


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
    const [fetching, setFetching] = React.useState<boolean>(false);
    const [entriesFilter, setEntriesFilter] = React.useState<string>('');
    
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

    const renderPatientEntries = (filter = '') => {
        return (
            <React.Fragment>
                {patientId && patients[patientId].entries && patients[patientId].entries.length > 0

                    ? <CardGroup>
                        {patients[patientId]
                            .entries.filter(entry => entry?.type?.includes(filter))
                            .map(entry => <PatientEntryCard key={entry.id} entry={entry} actions={entryActions} onEdit={onEditEntry} onDelete={onDeleteEntry} />)
                        }
                    </CardGroup>

                    : <em>no entries</em>
                }
            </React.Fragment>
        );
    };

    const onSubmitEntry = async (values: EntryFormValues) => {
        if(!patientId) return;
        let newEntry = Object.fromEntries(Object.entries(values).filter(([key, ]) => !specialEntryKeys.includes(key)));

        switch(values.type) {
            case EntryType.HealthCheckEntry:
                newEntry = {
                    ...newEntry,
                    //...(values.healthCheckRating !== undefined && { healthCheckRating: values.healthCheckRating })
                    //healthCheckRating: values.healthCheckRating as HealthCheckRating
                    healthCheckRating: Number(values.healthCheckRating) // select returns value as string!
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
            if(initialValues && values?.id) { // edit existing entry
                response = await putPatientEntry(patientId, values.id, newEntry);
            }
            else { // post new entry
                response = await postPatientEntry(patientId, newEntry);
                
            }
            dispatch(addPatient(response));
            closeEntryModal();
            //history.back();
        }
        catch(error) {
            console.error(error);
            if(axios.isAxiosError(error)) {
                setError(error?.response?.data.error as string);
            }
        }
    };

    const onEditEntry = (entry: Entry) => {
        setInitialValues(entry);
        openEntryModal();
    };

    const onDeleteEntry = async (entry: Entry) => {
        if(!patientId) return;
        try {
            //const { data: patient } = await axios.delete<Patient>(`${apiBaseUrl}/patients/${patientId}/entries/${entry.id}`);
            const patient = await deletePatientEntry(patientId, entry.id);
            dispatch(addPatient(patient));
        }
        catch(error) {
            console.log(error);
        }
    };

    const onSubmitPatient = async (patient: PatientFormValues) => {
        if(!patientId) return;
        try {
            const submittedPatient = await putPatient(patientId, patient);
            dispatch(addPatient(submittedPatient));
            closePatientModal();
        }
        catch(error: any) {
            if(axios.isAxiosError(error)) {
                console.log(error.response?.data);
                setError(error.response?.data.error as string);
            }
        }
    };

    const onEditPatient = (patient: Patient) => {
        setInitialValues(patient);
        openPatientModal();
    };

    const onDeletePatient = async (id: string) => {
        try {
            await deletePatient(id);
            dispatch(removePatient(id));
        }
        catch(error: unknown) {
            console.log(error);
            if(axios.isAxiosError(error)) {
                setError(error?.response?.data?.error as string);
            }
        }
    };

    useEffect(() => {
        if(patientId && (!patients[patientId] || !patients[patientId].entries)) {
            setFetching(true);
            void getPatient(patientId)
                .then(data => {
                    dispatch(addPatient(data as Patient));
                })
                .catch(error => {
                    console.error(`Patient id ${patientId} does not exist`, error);
                })
                .finally(() => {
                    setFetching(false);
                });
        }
        //setConfirm({ ...confirm, onCancel: closeConfirm });
    }, [patients[patientId || '']]);
    
    // nothing to render
    if(!patientId || patients[patientId] === null) {
        return null;
    }

    // patient does not exist
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
                            <Table.Row>
                                <Table.Cell>Health rating</Table.Cell>
                                <Table.Cell><HealthRatingBar showText rating={patients[patientId].healthRating} inlineText /></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1%', position: 'relative', top: '2rem' }}>
                    <div style={{ width: 'max-content'}}>
                        <Select
                            clearable
                            disabled={patients[patientId]?.entries?.length === 0}
                            placeholder="filter entries by type"
                            options={
                                [
                                    ...Object.values(EntryType).map(et => (
                                        {
                                            key: et,
                                            text: et.split(/([A-Z][a-z]+)/).filter(e => e).join(' '),
                                            value: et,
                                        }
                                    ))
                                ]
                            }
                            onChange={ (_event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => setEntriesFilter(data.value as string)}
                        />
                    </div>
                    <div style={{ width: 'max-content'}}>
                        <Button
                            as="a"
                            onClick={() => openEntryModal()}
                        >
                            add entry
                        </Button>
                    </div>
                </div>
                
                <div>
                    <h3>entries</h3>
                    {fetching
                        ? <Loader active content='Fetching entries' />
                        : renderPatientEntries(entriesFilter)
                    }
                    
                </div>
            </div>
            <AddPatientEntry modalOpen={entryModalOpen} onSubmit={onSubmitEntry} onClose={closeEntryModal} initialValues={initialValues as EntryFormValues} />
            <AddPatientModal modalOpen={patientModalOpen} onSubmit={onSubmitPatient} onClose={closePatientModal} error={error} initialValues={initialValues as PatientFormValues} />
            <Confirm {...confirm} />
        </div>
        
    );
};

export default PatientInfo;