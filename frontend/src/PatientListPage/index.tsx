import React from "react";
import axios from "axios";
import { Container, Table, Button, Icon, Input } from "semantic-ui-react";

import { PatientFormValues } from "../AddPatientModal/AddPatientForm";
import AddPatientModal from "../AddPatientModal";
import { Patient } from "../types/types";
import { apiBaseUrl } from "../constants";
import HealthRatingBar from "../components/HealthRatingBar";
import { useStateValue } from "../state";
import { Link } from "react-router-dom";

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  const [filter, setFilter] = React.useState<{ value: string, show: boolean }>({value: '', show: false});

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients`,
        values
      );
      dispatch({ type: "ADD_PATIENT", payload: newPatient });
      closeModal();
    } catch (e: any) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <div className="App" style={{ position: 'relative' }}>
      <Container textAlign="center">
        <h3>Patient list</h3>
      </Container>

      {/* patient filter tool */}
      <div style={{ width: '100%', display: 'inline-flex', justifyContent: 'flex-end', position: 'absolute', top: '-.25rem', right: '0' }}>
        <div style={{ display: 'inline-block', opacity: Number(filter.show), width: '25%', marginInlineEnd: '.25em', transition: '.2s' }}>
          <Input
            value={filter.value}
            fluid
            size="small"
            placeholder="filter by name"
            onChange={e => setFilter({ ...filter, value: e.target.value })}
          />
        </div>
        <div
          style={{ display: 'inherit', opacity: Number(filter.show), cursor: filter.value ? 'pointer' : 'auto' }}
          onClick={() => filter.value && setFilter({ ...filter, value: '' })}
          title="clear filter"
        >
          <Icon name="close" inverted={!filter.value} color={filter.value === '' ? 'grey' : 'black'} style={{ marginTop: '.5em' }}/>
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => setFilter({ ...filter, show: !filter?.show })}
          title={`filtering is ${filter.value ? 'on' : 'off'}`}
        >
          <Icon name="filter" inverted={!filter.show} style={{ marginTop: '.5em', transform: `scale(${filter.show ? 1 : 0.8})`, transition: '.2s' }} color={filter.value === '' ? 'grey' : 'black'}/>
        </div>
      </div>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Gender</Table.HeaderCell>
            <Table.HeaderCell>Occupation</Table.HeaderCell>
            <Table.HeaderCell>Health Rating</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.values(patients).filter(p => new RegExp(filter.value, 'i').test(p.name)).map((patient: Patient) => (
            <Table.Row key={patient.id}>
              <Table.Cell><Link to={`/patients/${patient.id}`}>{patient.name}</Link></Table.Cell>
              <Table.Cell>{patient.gender}</Table.Cell>
              <Table.Cell>{patient.occupation}</Table.Cell>
              <Table.Cell>
                <HealthRatingBar showText={false} rating={1} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Patient</Button>
    </div>
  );
};

export default PatientListPage;
