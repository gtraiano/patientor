import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Icon, Confirm, ConfirmProps } from "semantic-ui-react";

import { DiagnosisFormValues } from "../AddDiagnosisModal/AddDiagnosisForm";
import AddDiagnosisModal from "../AddDiagnosisModal";
import { Diagnosis } from "../types/types";
import { Action } from '../types/Action';
import { apiBaseUrl } from "../constants";
import { useStateValue, setDiagnosisList, addDiagnosis, removeDiagnosis } from "../state";

interface DiagnosisAction extends Action {
  callback: (code: string) => void;
}

const DiagnosisListPage = () => {
  const [{ diagnoses }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  const [modalInitialValues, setModalInitialValues] = React.useState<Diagnosis | undefined>(); // intitial values to pass on edit

  const actions: DiagnosisAction[] = [ // actions for diagnosis
    { label: 'edit', iconName: 'edit', callback: code => void loadValuesToModal(code) },
    { label: 'delete', iconName: 'trash',
      callback: (code) => openConfirm(
        `Delete diagnosis ${code} ${diagnoses[code].name}?`,
        () => {
          void deleteDiagnosis(code);
          closeConfirm();
        }
      )
    }
  ];

  const [confirm, setConfirm] = useState<ConfirmProps>({}); // confirmation modal props


  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
    setModalInitialValues(undefined);
  };

  const closeConfirm = (): void => {
    setConfirm({
      ...confirm,
      open: false,
      content: ''
    });
  };

  const openConfirm = (message: string, onConfirm?: () => void, onCancel?: () => void): void => {
    setConfirm({
      //...confirm,
      content: message,
      open: true,
      /*...onConfirm && { onConfirm: onConfirm },
      ...onCancel && { onCancel: onCancel }*/
      onConfirm: onConfirm || confirm.onConfirm,
      onCancel: onCancel || closeConfirm
    });
  };

  const submitDiagnosis = async (values: DiagnosisFormValues) => {
    try {
      const { data: newDiagnosis } = modalInitialValues === undefined
        ? await axios.post<Diagnosis>(`${apiBaseUrl}/diagnoses`, values)
        : await axios.put<Diagnosis>(`${apiBaseUrl}/diagnoses/${values.code}`, values);
      dispatch(addDiagnosis(newDiagnosis));
      closeModal();
    } catch (e: any) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  /*const updateDiagnosis = async (values: DiagnosisFormValues) => {
    try {
      const { data: newDiagnosis } = await axios.put<Diagnosis>(
        `${apiBaseUrl}/diagnoses/${values.code}`,
        values
      );
      dispatch(addDiagnosis(newDiagnosis));
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };*/

  const deleteDiagnosis = async (code: string) => {
    try {
      //if(window.confirm(`Delete diagnosis ${code} ${diagnoses[code].name}?`)) {
        await axios.delete<void>(`${apiBaseUrl}/diagnoses/${code}`);
        dispatch(removeDiagnosis(code));
      //}
      closeModal();
    }
    catch(e: any) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  const loadValuesToModal = (code: string) => {
    setModalInitialValues(diagnoses[code]);
    openModal();
  };

  useEffect(() => {
    const fetchDiagnosisList = async () => {
        try {
          const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
          dispatch(setDiagnosisList(diagnosisListFromApi));
        }
        catch(error) {
          console.error(error);
        }
    };
    if(!diagnoses) {
        void fetchDiagnosisList();
    }
    setConfirm({ ...confirm, onCancel: closeConfirm });
  }, []);

  return (
    <div className="App">
      <Container textAlign="center">
        <h3>Diagnosis list</h3>
      </Container>

      <div style={{ maxHeight: '75vh', overflowY: 'auto', margin: '1em 0' }}>
        <Table celled>
            <Table.Header className='sticky-header'>
              <Table.Row>
                  <Table.HeaderCell>Code</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Latin</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
            {Object.values(diagnoses).map((diagnosis: Diagnosis) => (
                <Table.Row key={diagnosis.code}>
                  <Table.Cell>{diagnosis.code}</Table.Cell>
                  <Table.Cell>{diagnosis.name}</Table.Cell>
                  <Table.Cell>{diagnosis?.latin}</Table.Cell>
                  <Table.Cell singleLine>
                    <div>
                    {actions.map(a =>
                      <div
                        key={`${diagnosis.code}_action_${a.label}`}
                        style={{ display: 'inline-block', cursor: 'pointer' }}
                        onClick={() => { a.callback(diagnosis.code); }}
                      >
                        <Icon name={a.iconName} title={a.label}/>
                      </div>
                    )}
                    </div>
                  </Table.Cell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table>
      </div>

      <AddDiagnosisModal
        modalOpen={modalOpen}
        onSubmit={submitDiagnosis/*modalInitialValues === undefined ? submitDiagnosis : updateDiagnosis*/}
        error={error}
        onClose={closeModal}
        initialValues={modalInitialValues}
      />
      <Button onClick={() => openModal()}>Add New Diagnosis</Button>
      <Confirm {...confirm} />
    </div>
  );
};

export default DiagnosisListPage;
