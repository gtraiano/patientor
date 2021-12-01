import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import AddEntryForm, { EntryFormValues } from "./AddEntryForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  initialValues: EntryFormValues | undefined;
  error?: string;
}

const AddPatientEntry = ({ modalOpen, onSubmit, onClose, initialValues, error }: Props) => {
    return (
        <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
            <Modal.Header>{initialValues === undefined ? 'Add a new' : 'Edit'} entry</Modal.Header>
            <Modal.Content>
                {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
                <AddEntryForm onSubmit={onSubmit} onCancel={onClose} initialValues={initialValues} />
            </Modal.Content>
        </Modal>
    );
};

export default AddPatientEntry;