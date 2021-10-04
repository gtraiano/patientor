import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { addDiagnosis, useStateValue } from '../state';
import { TextField, NumberField, DateField, SelectEntryType, SelectDiagnosis } from '../components/FormFields';
import { Diagnosis, EntryType, Discharge, HealthCheckRating, SickLeave } from '../types/types';
import { Button, DropdownOnSearchChangeData } from 'semantic-ui-react';
import AddDiagnosisModal from '../AddDiagnosisModal';
import axios from 'axios';
import { apiBaseUrl } from '../constants';

export type EntryFormValues = {
    id?: string;
    description: string;
    date: string | Date;
    specialist: string;
    diagnosisCodes?: Array<Diagnosis['code']>,
    type: string,
    healthCheckRating?: HealthCheckRating,
    discharge?: Discharge,
    employerName?: string,
    sickLeave?: SickLeave,
};

interface AnyObject {
    [key: string]: string | null;
}

interface Props {
    onSubmit: (values: EntryFormValues) => void;
    onCancel: () => void;
    initialValues?: EntryFormValues;
}

const AddEntryForm = ({ onSubmit, onCancel, initialValues }: Props) => {
    const [{ diagnoses }, dispatch] = useStateValue();
    const [searchQuery, setSearchQuery] = useState<{ query: string, exists: boolean } | undefined>(undefined);
    const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onSubmitDiagnosis = async (diagnosis: Diagnosis) => {
        try {
            const res = await axios.post<Diagnosis>(`${apiBaseUrl}/diagnoses`, diagnosis);
            dispatch(addDiagnosis(res.data));
            setSearchModalOpen(false);
        }
        catch(error: any) {
            if(axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
            else {
                setError(error.message);
            }
            console.log(error);
            //setError(error.response.data.message);
        }
    };

    const onSearchChange = (e: React.SyntheticEvent<HTMLElement, Event>, d: DropdownOnSearchChangeData) => {
        // check if filtered search results include query
        const exists = e.currentTarget.parentElement?.lastElementChild?.textContent?.toLowerCase().includes(d.searchQuery.trim().toLowerCase());
        !exists
            ? e.currentTarget.parentElement?.lastElementChild?.classList.remove('visible') // hide dropdown menu if not
            : e.currentTarget.parentElement?.lastElementChild?.classList.add('visible');
        setSearchQuery({
            query: d.searchQuery.trim(),
            exists: exists || false
        });
    };

    return (
        <React.Fragment>
        <Formik
            initialValues={
                !initialValues
                ? {
                    description: '',
                    date: new Date(),
                    specialist: '',
                    type: '',
                    healthCheckRating: 0,
                    discharge: {
                        date: '',
                        criteria: ''
                    },
                    employerName: '',
                    sickLeave: {
                        startDate: '',
                        endDate: ''
                    },
                    diagnosisCodes: [],
                }
                : {
                    id: initialValues.id, // used to pass entry id to onSubmit
                    description: initialValues.description,
                    date: initialValues.date,
                    specialist: initialValues.specialist,
                    type: initialValues.type,
                    healthCheckRating: initialValues.healthCheckRating || 0,
                    discharge: {
                        date: initialValues.discharge?.date || '',
                        criteria: initialValues.discharge?.criteria || ''
                    },
                    employerName: initialValues.employerName || '',
                    sickLeave: {
                        startDate: initialValues.sickLeave?.startDate || '',
                        endDate: initialValues.sickLeave?.endDate || ''
                    },
                    diagnosisCodes: initialValues.diagnosisCodes || [],
                }
            }
            onSubmit={onSubmit}
            validate={(values) => {
                const requiredError = "Field is required";
                const errors: { [field: string]: string | AnyObject } = {};
                if (!values.description) {
                errors.description = requiredError;
                }
                if (!values.date) {
                    errors.date = requiredError;
                }
                if (!values.specialist) {
                errors.specialist = requiredError;
                }
                if (!values.type) {
                errors.type = requiredError;
                }
                if(values.type === EntryType.HealthCheckEntry && values.healthCheckRating !== undefined && (values.healthCheckRating < 0 || values.healthCheckRating > 4)) {
                    errors.healthCheckRating = requiredError;
                }
                if(values.type === EntryType.HospitalEntry) {
                    if(values.discharge && !values.discharge.date)
                        errors.discharge = Object.assign({ date: requiredError }, errors.discharge);
                    if(values.discharge && !values.discharge.criteria)
                        errors.discharge = Object.assign({ criteria: requiredError }, errors.discharge);
                }
                if(values.type === EntryType.OccupationalHealthcareEntry) {
                    if(!values.employerName) {
                        errors.employerName = requiredError;   
                    }
                }

                return errors;
            }}
        >
        {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
            return (
                <Form className="form ui">
                    <Field
                        label="Description"
                        placeholder="Description"
                        name="description"
                        component={TextField}
                    />
                    <Field
                        label="Date"
                        placeholder="YYYY-MM-DD"
                        name="date"
                        component={DateField}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                    />
                    <Field
                        label="Specialist"
                        placeholder="Specialist"
                        name="specialist"
                        component={TextField}
                    />
                    <Field
                        label="Entry type"
                        name="type"
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        entryTypes={Object.values(EntryType)}
                        component={SelectEntryType}
                        initialValue={initialValues?.type}
                    />
                    
                    {values.type === EntryType.HealthCheckEntry &&
                        <Field
                            label="Health check rating"
                            placeholder="Health check rating"
                            name="healthCheckRating"
                            min={0}
                            max={4}
                            component={NumberField}
                        />
                    }
                    {values.type === EntryType.HospitalEntry &&
                        <React.Fragment>
                        <Field
                            label="Discharge Date"
                            placeholder="YYYY-MM-DD"
                            name="discharge.date"
                            component={DateField}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                        />
                        <Field
                            label="Discharge criteria"
                            placeholder="criteria"
                            name="discharge.criteria"
                            component={TextField}
                        />
                        </React.Fragment>
                    }
                    {values.type === EntryType.OccupationalHealthcareEntry &&
                        <React.Fragment>
                        <Field
                            label="Empolyer Name"
                            placeholder="Employer name"
                            name="employerName"
                            component={TextField}
                        />
                        <Field
                            label="Sick Leave Start Date"
                            placeholder="YYYY-MM-DD"
                            name="sickLeave.startDate"
                            component={DateField}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                        />
                        <Field
                            label="Sick Leave End Date"
                            placeholder="YYYY-MM-DD"
                            name="sickLeave.endDate"
                            component={DateField}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                        />
                        </React.Fragment>
                    }
                    <Field
                        label="Diagnosis"
                        placeholder="Diagnosis"
                        name="diagnosisCodes"
                        diagnoses={Object.values(diagnoses)}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        component={SelectDiagnosis}
                        initialValues={initialValues?.diagnosisCodes}
                        onSearchChange={onSearchChange}
                    />

                    { searchQuery && !searchQuery.exists &&
                        <div>
                            <span>&lsquo;{searchQuery.query}&rsquo; does not exist in diagnoses.</span>&nbsp;
                            <a
                                href=""
                                onClick={ e => {
                                    e.preventDefault();
                                    setSearchModalOpen(true);
                                }
                            }>
                                Search or add it.
                            </a>
                        </div>
                    }
                    
                    <div style={{ marginLeft: 'auto', marginRight: 'auto', width: 'max-content' }}>
                        <Button color="green" type="submit" disabled={!dirty || !isValid}>Submit</Button>
                        <Button color="red" type="button" onClick={() => onCancel()}>Cancel</Button>
                        <Button color="blue" type="reset">Reset</Button>
                    </div>
                </Form>
                );
            }}
            </Formik>
            <AddDiagnosisModal
                modalOpen={searchModalOpen}
                onClose={() => {
                        setSearchModalOpen(false);
                        setSearchQuery({ query: '', exists: true });
                    }
                }
                onSubmit={onSubmitDiagnosis}
                initialValues={undefined}
                error={error}
            />
        </React.Fragment>
    );
};

export default AddEntryForm;