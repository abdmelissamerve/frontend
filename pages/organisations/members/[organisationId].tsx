import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  SyntheticEvent,
  useContext
} from 'react';

import Head from 'next/head';
import { AbilityContext } from '@/contexts/Can';
import NotAuthorized from '../../status/not_authorized';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';

import { Grid } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import PageHeader from 'src/content/Services/Organisations/Members/PageHeader';
import Results from 'src/content/Services/Organisations/Members/Results';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { getOrganisationMembers } from 'src/services/organisations';
import { useFetchData } from '@/hooks/useFetch';
import { useRouter } from 'next/router';

function ManagementMembers() {
  const ability = useContext(AbilityContext);
  const router = useRouter();
  const isMountedRef = useRefMounted();
  const { data, loading, error, fetchData } = useFetchData(
    getOrganisationMembers
  );

  const getMembersCallback = useCallback(
    (data: any) => {
      fetchData({
        search: data.search,
        order_by: data.order_by,
        skip: data.skip,
        limit: data.limit,
        type: data.type,
        id: router.query.organisationId
      });
    },
    [isMountedRef]
  );

  interface Data {
    name: string;
    domain: string;
    actions: string;
  }

  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [orderBy, setOrderBy] = useState('name');

  interface Filters {
    type: string;
  }

  const [filters, setFilters] = useState<Filters>({
    type: 'members'
  });

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property;
    setOrderBy(isAsc ? `-${property}` : property);
  };

  const createSortHandler = async (property: keyof Data) => {
    handleRequestSort(property);
  };

  const handleQueryChange = (query: string) => {
    setPage(0);
    setQuery(query);
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  useEffect(() => {
    getMembersCallback({
      search: query,
      order_by: orderBy,
      skip: limit * page,
      limit: limit,
      type: filters.type
    });
  }, [limit, orderBy, query, page, filters]);

  useEffect(() => {
    if (!data?.length) {
      setPage((prevPage) => Math.max(0, prevPage - 1));
    }
  }, [data]);

  const handleTabsChange = async (
    _event: SyntheticEvent,
    tabsValue: unknown
  ) => {
    let value = null;
    value = tabsValue;
    setPage(0);
    setFilters((prevFilters) => ({
      ...prevFilters,
      type: value
    }));
  };

  if (!ability.can('read', 'Oganisation-Members')) {
    return <NotAuthorized />;
  }

  return (
    <>
      <Head>
        <title>Organisations - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          getMembers={getMembersCallback}
          limit={limit}
          query={query}
          page={page}
          filters={filters}
        />
      </PageTitleWrapper>
      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Results
            members={data}
            getMembers={getMembersCallback}
            handleQueryChange={handleQueryChange}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            handleTabsChange={handleTabsChange}
            page={page}
            limit={limit}
            createSortHandler={createSortHandler}
            orderBy={orderBy}
            loading={loading}
            error={error}
            filters={filters}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementMembers.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementMembers;
