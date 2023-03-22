import { useState, useEffect, useCallback, ChangeEvent } from 'react';

import Head from 'next/head';
import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';

import PageHeader from '@/content/Services/ProviderChanges/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import { Grid } from '@mui/material';
import Results from '@/content/Services/ProviderChanges/Results';
import { useRefMounted } from 'src/hooks/useRefMounted';
import { getProviders } from '@/services/providers';
import { useFetchData } from '@/hooks/useFetch';

interface Data {
  id: number;
  name: string;
  site: string;
  login_link: string;
  affiliate_link: string;
  worker_count: number;
  actions: string;
  changes: any;
}

function Providers() {
  const isMountedRef = useRefMounted();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [query, setQuery] = useState<string>('');
  const [orderBy, setOrderBy] = useState('');
  const { data, loading, error, fetchData } = useFetchData(getProviders);

  const getProvidersList = useCallback(
    (payload: any) => {
      fetchData({
        search: payload?.search,
        sort_by: payload?.sortBy,
        skip: payload?.skip,
        limit: payload?.limit
      });
    },
    [isMountedRef]
  );

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property;
    setOrderBy(isAsc ? `-${property}` : property);
  };

  const createSortHandler = async (property: keyof Data) => {
    handleRequestSort(property);
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleQueryChange = (query: string) => {
    setPage(0);
    setQuery(query);
  };

  useEffect(() => {
    getProvidersList({
      search: query,
      sortBy: orderBy,
      skip: limit * page,
      limit: limit
    });
  }, [limit, orderBy, query, page]);

  useEffect(() => {
    if (!data?.length) {
      setPage((prevPage) => Math.max(0, prevPage - 1));
    }
  }, [data]);
  return (
    <>
      <Head>
        <title>Providers</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
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
            providers={data}
            getProvidersList={getProvidersList}
            page={page}
            limit={limit}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            handleQueryChange={handleQueryChange}
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

Providers.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Providers;
