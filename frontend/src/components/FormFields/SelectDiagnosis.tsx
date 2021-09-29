import { ErrorMessage, FieldInputProps, FormikProps } from 'formik';
import React from 'react';
import { Dropdown, DropdownOnSearchChangeData, DropdownProps, Form } from 'semantic-ui-react';
import { Diagnosis } from '../../types/types';

export const SelectDiagnosis = ({
    field,
    diagnoses,
    setFieldValue,
    setFieldTouched,
    initialValues,
    onSearchChange
}: {
    field: FieldInputProps<string>;
    diagnoses: Diagnosis[];
    setFieldValue: FormikProps<{ diagnosisCodes: string[] }>["setFieldValue"];
    setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>["setFieldTouched"];
    initialValues: Array<Diagnosis['code']>;
    onSearchChange?: (e: React.SyntheticEvent<HTMLElement, Event>, d: DropdownOnSearchChangeData) => void
}) => {
  
    const onChange = (
        _event: React.SyntheticEvent<HTMLElement, Event>,
        data: DropdownProps
    ) => {
        setFieldTouched(field.name, true);
        setFieldValue(field.name, data.value);
    };
  
    const stateOptions = diagnoses.map(diagnosis => ({
        key: diagnosis.code,
        text: `${diagnosis.name} (${diagnosis.code})`,
        value: diagnosis.code
    }));
  
    return (
        <Form.Field>
            <label>Diagnoses</label>
            <Dropdown
                fluid
                multiple
                search
                selection
                options={stateOptions}
                onChange={onChange}
                defaultValue={initialValues || undefined}
                onSearchChange={onSearchChange}
        />
            <ErrorMessage name={field.name} />
      </Form.Field>
    );
};