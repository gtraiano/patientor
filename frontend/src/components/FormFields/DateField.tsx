import { ErrorMessage, Field, FormikProps } from 'formik';
import React, { useEffect } from 'react';
import { Form } from 'semantic-ui-react';
import { TextProps } from './';

// date picker
export interface DateProps extends TextProps {
    dateFormatter: (date: string | Date) => string,
    setFieldValue: FormikProps<{ date: string | Date }>["setFieldValue"];
    setFieldTouched: FormikProps<{ date: string | Date }>["setFieldTouched"];
}
  
  // formats date to YYYY-MM-DD string for HTML date picker attribute
export const formatDate = (date: string | Date): string => {
    if(!date || !(String(date)).trim().length) {
      return '';
    }
    if(typeof date === 'string' || date instanceof Date) {
      if(Number.isNaN(Date.parse(date as string))) {
        throw new Error('Invalid date');
      }
      const parts = new Date(date).toLocaleDateString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');
      return `${parts[2]}-${parts[0]}-${parts[1]}`;
    }
    else {
      throw new Error('Date must be of type string or Date');
    }
};
  
// date picker field component
export const DateField = ({
    field,
    label,
    placeholder,
    dateFormatter = formatDate,
    setFieldTouched,
    setFieldValue
}: DateProps) => {
  
    useEffect(() => { // initialize date from field prop
      if(field.value !== undefined || field.value !== null) {
        setFieldValue(field.name, dateFormatter(field.value));
        setFieldTouched(field.name, false);
      }
    }, []);
  
    useEffect(() => { // instead of onChange for field prop
      if(!/\d{1,2}-\d{1,2}-\d{4}/g.test(field.value)) // do nothing until field is filled in
        return;
      setFieldValue(field.name, dateFormatter(field.value));
      setFieldTouched(field.name, true);
    }, [field.value]);
  
    return (
        <Form.Field>
            <label>{label}</label>
            <Field type="date" placeholder={placeholder} {...field} />
            <div style={{ color:'red' }}>
                <ErrorMessage name={field.name} />
            </div>
        </Form.Field>
    );
};