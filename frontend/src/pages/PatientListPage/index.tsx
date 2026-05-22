import React, { ReactElement } from "react";

import axios, { postPatient } from "../../controllers";
import { useStateValue } from "../../state";

import { HealthCheckRating, Patient } from "../../types/types";
import { Container, TableCell, Button, Icon, Input } from "semantic-ui-react";
import { PatientFormValues } from "../../components/AddPatientModal/AddPatientForm";
import AddPatientModal from "../../components/AddPatientModal";
import HealthRatingBar from "../../components/HealthRatingBar";
import { Link } from "react-router-dom";
import { addPatient } from "../../state/actions";

import SortableTable from "../../components/SortableTable";

// Link component does not have name defined!
Link.name === undefined && Object.assign(Link, { name: 'Link' });

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  const [filter, setFilter] = React.useState<{ value: string, show: boolean }>({ value: '', show: false });

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const data = await postPatient(values);
      dispatch(addPatient(data));
      closeModal();
    }
    catch (e) {
      if (axios.isAxiosError(e)) {
        console.error(e.response?.data || 'Unknown Error');
        setError(e.response?.data?.error as string || 'Unknown error');
      }
    }
  };

  const sortFunc = (key: keyof Patient | undefined, order: boolean | undefined): (a: Patient, b: Patient) => number => {
    const TableCellType: string = TableCell.name;
    const HealthRatingBarType: string = HealthRatingBar.name;
    const LinkType: string = Link.name;

    const asElement = (val: unknown): ReactElement => val as ReactElement;
    const typeName = (val: unknown): string | undefined => {
      const el = val as ReactElement;
      return el?.type && typeof el.type !== 'string'
        ? (el.type as React.ComponentType).displayName ?? (el.type as React.ComponentType).name
        : undefined;
    };

    return (a, b): number => {
      if (key === undefined) return 0;
      const av = a[key], bv = b[key];
      if (!av || !bv) return 0;

      if (typeof av === 'string') return (av).localeCompare(bv as string, 'en', { sensitivity: 'base' }) * (order ? 1 : -1);
      if (typeof av === 'number') return ((av) - (bv as number)) * (order ? 1 : -1);

      if (typeName(av) === LinkType)
        return (asElement(av).props.children as string).localeCompare(asElement(bv).props.children as string, 'en', { sensitivity: 'base' }) * (order ? 1 : -1);

      if (typeName(av) === TableCellType) {
        const aChild = asElement(asElement(av).props.children);
        const bChild = asElement(asElement(bv).props.children);
        if (typeName(aChild) === HealthRatingBarType)
          return (aChild.props.rating - bChild.props.rating) * (order ? 1 : -1);
      }

      return 0;
    };
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
          <Icon name="close" inverted={!filter.value} color={filter.value === '' ? 'grey' : 'black'} style={{ marginTop: '.5em' }} />
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => setFilter({ ...filter, show: !filter?.show })}
          title={`filtering is ${filter.value ? 'on' : 'off'}`}
        >
          <Icon name="filter" inverted={!filter.show} style={{ marginTop: '.5em', transform: `scale(${filter.show ? 1 : 0.8})`, transition: '.2s' }} color={filter.value === '' ? 'grey' : 'black'} />
        </div>
      </div>

      <SortableTable<Patient>
        data={Object.values(patients)
          .filter(p => new RegExp(filter.value, 'i').test(p.name))
          .map(p => ({
            ...p,
            name: <Link to={`/patients/${p.id}`}>{p.name}</Link>,
            healthRating:
              <TableCell title={HealthCheckRating[p.healthRating].replace(/([a-z])([A-Z])/g, '$1 $2')}>
                <HealthRatingBar showText={false} rating={p.healthRating} />
              </TableCell>
          }))
        }
        header={[
          { key: 'name', sortable: true },
          { key: 'gender', sortable: false },
          { key: 'occupation', sortable: true },
          { key: 'healthRating', sortable: true, alias: 'Health Rating' },
        ]}
        sortFunc={sortFunc}
      />

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
