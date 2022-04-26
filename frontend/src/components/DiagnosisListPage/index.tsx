import React, { useEffect, useState } from "react";
import axios from "../../controllers";
import { Container, Button, Confirm, ConfirmProps } from "semantic-ui-react";

import { DiagnosisFormValues } from "../AddDiagnosisModal/AddDiagnosisForm";
import AddDiagnosisModal from "../AddDiagnosisModal";
import { Diagnosis } from "../../types/types";
import { apiBaseUrl } from "../../constants";
import { useStateValue } from '../../state';
import { addDiagnosis, removeDiagnosis, setDiagnosisList } from "../../state/actions/diagnoses";

import SortableTable, { GenericAction } from '../SortableTable';

const DiagnosisListPage = () => {
  const [{ diagnoses }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  const [modalInitialValues, setModalInitialValues] = React.useState<Diagnosis | undefined>(); // intitial values to pass on edit

  const actions: GenericAction<Diagnosis>[] = [ // actions for diagnosis
    { label: 'edit', iconName: 'edit', arg: 'code', callback: code => void loadValuesToModal(code) },
    { label: 'delete', iconName: 'trash',
      arg: 'code',
      callback: (code: string) => openConfirm(
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
    }
    catch (e) {
      if(axios.isAxiosError(e)) {
        console.error(e.response?.data || 'Unknown Error');
        setError(e.response?.data?.error as string || 'Unknown error');
      }
    }
  };

  const deleteDiagnosis = async (code: string) => {
    try {
        await axios.delete<void>(`${apiBaseUrl}/diagnoses/${code}`);
        dispatch(removeDiagnosis(code));
      closeModal();
    }
    catch(e) {
      if(axios.isAxiosError(e)) {
        console.error(e.response?.data || 'Unknown Error');
        setError(e.response?.data?.error as string || 'Unknown error');
      }
    }
  };

  const loadValuesToModal = (code: string) => {
    setModalInitialValues(diagnoses[code]);
    openModal();
  };

  const sortFunc = (key: keyof Diagnosis|undefined, order: boolean|undefined): (a: Diagnosis, b: Diagnosis) => number => {
    return (a: Diagnosis, b: Diagnosis): number => {
      if(key === undefined) return 0;
      if(!a[key] || !b[key]) return 0;
      return typeof a[key] === 'string'
        ? (a[key] as string).localeCompare(b[key] as string, 'en', { sensitivity: 'base' }) * (order ? 1 : -1)
        : (a[key] as string).localeCompare(b[key] as string, 'en', { numeric: true }) * (order ? 1 : -1);
    };
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
          <SortableTable<Diagnosis>
              data={Object.values(diagnoses).map(d => d)}
              header={[
                {key: 'code', sortable: true },
                {key: 'name', sortable: true},
                {key: 'latin', sortable: false}
              ]}
              sortFunc={sortFunc}
              actions={actions.map(a => ({ ...a, arg: 'code' }))}
          />
      </div>

      <AddDiagnosisModal
        modalOpen={modalOpen}
        onSubmit={submitDiagnosis}
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
