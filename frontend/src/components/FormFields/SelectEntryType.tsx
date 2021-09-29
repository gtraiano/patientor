import { FieldInputProps, FormikProps, ErrorMessage } from 'formik';
import React from 'react';
import { DropdownProps, Form, Dropdown } from 'semantic-ui-react';
import { EntryType } from '../../types/types';

export const SelectEntryType = ({
    field,
    entryTypes,
    setFieldValue,
    setFieldTouched,
    initialValue
}: {
    field: FieldInputProps<string>;
    entryTypes: EntryType[];
    setFieldValue: FormikProps<{ type: string[] }>["setFieldValue"];
    setFieldTouched: FormikProps<{ type: string[] }>["setFieldTouched"];
    initialValue: EntryType
}) => {
  
    const onChange = (
        _event: React.SyntheticEvent<HTMLElement, Event>,
        data: DropdownProps
    ) => {
        setFieldTouched(field.name, true);
        setFieldValue(field.name, data.value);
    };
  
    const entryTypesToOptions = entryTypes.map(type => ({
        key: type,
        text: type.split(/([A-Z][a-z]+)/g).filter(v => v !== '').join(' '),
        value: type
    }));
  
    return (
        <Form.Field>
            <label>Entry type</label>
        <Dropdown
            fluid
            search
            selection
            options={entryTypesToOptions}
            onChange={onChange}
            defaultValue={initialValue || undefined}
        />
            <ErrorMessage name={field.name} />
      </Form.Field>
    );
};