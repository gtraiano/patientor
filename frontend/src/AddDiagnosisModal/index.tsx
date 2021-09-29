import React from 'react';
import { Modal, Segment, Tab } from 'semantic-ui-react';
import { Diagnosis } from '../types/types';
import AddDiagnosisForm, { DiagnosisFormValues } from './AddDiagnosisForm';
import SearchICDCodeForm from '../SearchICDCode';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: DiagnosisFormValues) => void;
  error?: string;
  initialValues: Diagnosis | undefined;
}

const AddDiagnosisModal = ({ modalOpen, onClose, onSubmit, error, initialValues }: Props) => {
  const tabs = () => {
    return (
      <Tab
        panes={[
          {
            menuItem: 'add',
            // eslint-disable-next-line react/display-name
            render: () =>
              <Tab.Pane>
                {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
                <AddDiagnosisForm onSubmit={onSubmit} onCancel={onClose} initialValues={initialValues} />
              </Tab.Pane>
          },
          // eslint-disable-next-line react/display-name
          initialValues === undefined ? { menuItem: 'search', render: () => <Tab.Pane><SearchICDCodeForm/></Tab.Pane> } : {}
        ]}
        renderActiveOnly={true}
      />
    );
  };
  return (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>{initialValues !== undefined ? 'Edit' : 'Add a'} diagnosis</Modal.Header>
    <Modal.Content>
      {/*error && <Segment inverted color="red">{`Error: ${error}`}</Segment>*/}
      {tabs()}
    </Modal.Content>
  </Modal>
  );
};

export default AddDiagnosisModal;
