import {
  useState,
  useContext,
  useEffect,
  useCallback,
  ChangeEvent
} from 'react';

import Head from 'next/head';
import { AbilityContext } from '@/contexts/Can';
import NotAuthorized from '../status/not_authorized';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';

import { Grid, Typography, Card } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import PageHeader from 'src/content/Services/Organisations/single/PageHeader';
import MembersResults from 'src/content/Services/Organisations/single/MembersResults';
import ServicesResults from 'src/content/Services/Organisations/single/ServicesResults';
import { useRouter } from 'next/router';

import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { getOrganisation } from 'src/services/organisations';
import { useFetchData } from '@/hooks/useFetch';

function ManagementOrganisations() {
  const isMountedRef = useRefMounted();
  const { data, loading, error, fetchData } = useFetchData(getOrganisation);
  const router = useRouter();
  const [organisation, setOrganisation] = useState<any>();
  const organisationId = router.query.organisationId;
  const ability = useContext(AbilityContext);

  const getOrganisationCallback = useCallback(
    async (organisationId) => {
      try {
        const response = await getOrganisation(organisationId);
        if (isMountedRef()) {
          setOrganisation(response.data);
        }
      } catch (err) {
        console.error(err);
        if (err.kind == 'rejected') {
          router.push('/404');
        }
      }
    },
    [isMountedRef]
  );

  interface Data {
    name: string;
    domain: string;
    actions: string;
  }

  useEffect(() => {
    getOrganisationCallback(organisationId);
  }, []);

  if (!organisation) {
    return null;
  }

  if (!ability.can('read', 'Organisation-Details')) {
    return <NotAuthorized />;
  }

  return (
    <>
      <Head>
        <title>Organisations - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader organisation={organisation} />
      </PageTitleWrapper>
      <Typography
        sx={{ marginLeft: 4 }}
        data-cy="general-information-title"
        variant="h4"
        gutterBottom
      >
        General information
      </Typography>
      <Card
        sx={{
          padding: 1.5,
          marginLeft: 4,
          marginRight: 4,
          marginBottom: 3
        }}
      >
        <Typography>Organisation's uuid: {organisation.uuid}</Typography>
        <Typography>Organisation's website: {organisation.website}</Typography>
        {organisation.logourl && (
          <Typography>
            Organisation's logo url: {organisation.logourl}
          </Typography>
        )}
      </Card>
      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        {/* <Grid item xs={12}>
          <MembersResults organisationId={organisationId} />
        </Grid> */}

        {/* <Grid item xs={12}>
          <ServicesResults organisationId={organisationId} />
        </Grid> */}
      </Grid>
      <Footer />{' '}
    </>
  );
}

ManagementOrganisations.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementOrganisations;
