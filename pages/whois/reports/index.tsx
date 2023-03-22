import {
  useState,
  useContext,
  useEffect,
  useCallback,
  ChangeEvent
} from 'react';

import Head from 'next/head';
import { AbilityContext } from '@/contexts/Can';
import NotAuthorized from '../../status/not_authorized';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';

import { Grid, Zoom } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import PageHeader from 'src/content/Services/WhoIsReports/PageHeader';
import Results from 'src/content/Services/WhoIsReports/Results';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { getWhoIsReports } from 'src/services/whois';
import { useTranslation } from 'react-i18next';
import { useFetchData } from '@/hooks/useFetch';

function WhoIsReports() {
  const ability = useContext(AbilityContext);
  const isMountedRef = useRefMounted();
  const [whoIsReports, setWhoIsReports] = useState([]);
  const { t }: { t: any } = useTranslation();
  const { data, loading, error, fetchData } = useFetchData(getWhoIsReports);

  const getWhoisReport = useCallback(
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
  const [orderBy, setOrderBy] = useState('-created_at');

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
    getWhoisReport({
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

  if (!ability.can('read', 'WhoIs')) {
    return <NotAuthorized />;
  }

  return (
    <>
      <Head>
        <title>WhoIs - Reports</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          getWhoIsReports={getWhoisReport}
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
            whoIsReports={data}
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

WhoIsReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default WhoIsReports;

function enqueueSnackbar(
  arg0: any,
  arg1: {
    variant: string;
    anchorOrigin: { vertical: string; horizontal: string };
    TransitionComponent: any;
  }
) {
  throw new Error('Function not implemented.');
}
