import {
  useState,
  useContext,
  useEffect,
  useCallback,
  ChangeEvent
} from 'react';

import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';

import { Grid } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import PageHeader from 'src/content/Services/BlocklistOrganisation/PageHeader';
import Results from 'src/content/Services/BlocklistOrganisation/Results';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { getBlockListOrganisation } from 'src/services/blocklist';
import { useFetchData } from '@/hooks/useFetch';
import { AbilityContext } from '@/contexts/Can';
import NotAuthorized from '../status/not_authorized';

function ManagementBlocklists() {
  const isMountedRef = useRefMounted();
  const ability = useContext(AbilityContext);
  const { data, loading, error, fetchData } = useFetchData(
    getBlockListOrganisation
  );

  const getBlocklists = useCallback(
    (data: any) => {
      fetchData({
        search: data.search,
        order_by: data.order_by,
        skip: data.skip,
        limit: data.limit
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
    getBlocklists({
      search: query,
      order_by: orderBy,
      skip: limit * page,
      limit: limit
    });
  }, [limit, orderBy, query, page]);

  useEffect(() => {
    if (!data?.length) {
      setPage((prevPage) => Math.max(0, prevPage - 1));
    }
  }, [data]);

  if (!ability.can('read', 'Blocklist')) {
    return <NotAuthorized />;
  }

  return (
    <>
      <Head>
        <title>Blocklists - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          getBlocklists={getBlocklists}
          limit={limit}
          query={query}
          page={page}
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
            blocklists={data}
            getBlocklists={getBlocklists}
            handleQueryChange={handleQueryChange}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            page={page}
            limit={limit}
            createSortHandler={createSortHandler}
            orderBy={orderBy}
            loading={loading}
            error={error}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementBlocklists.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementBlocklists;
