import {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  ChangeEvent,
  useContext
} from 'react';
import { useRefMounted } from 'src/hooks/useRefMounted';
import Head from 'next/head';
import { Authenticated } from '@/components/Authenticated';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import PageHeader from '@/content/Services/Workers/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import { Grid, Zoom } from '@mui/material';
import Results from '@/content/Services/Workers/Results';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useFetchData } from '@/hooks/useFetch';
import { getWorkers } from '@/services/workers';
import { AbilityContext } from '@/contexts/Can';
import NotAuthorized from '../status/not_authorized';

interface Filters {
  ipType?: string;
  disabled?: string;
}

interface Data {
  id: number;
  port: number;
  provider: string;
  continent: string;
  country: string;
  city: string;
  data_center: string;
  ipv4: string;
  ipv6: string;
  asn: string;
  coordinates: string;
  paymentDate: string;
  paymentRecurrence: string;
  price: number;
  currency: string;
  actions: string;
}

function Workers() {
  const router = useRouter();
  const isMountedRef = useRefMounted();
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [providers, setProviders] = useState([]);
  const [query, setQuery] = useState<string>('');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [count, setCount] = useState(0);
  const { data, loading, error, fetchData } = useFetchData(getWorkers);
  const ability = useContext(AbilityContext);

  const getWorkersList = useCallback(
    (payload: any) => {
      fetchData({
        search: payload?.search,
        disabled: payload?.disabled,
        ip_type: payload?.ipType,
        provider_id: payload?.providerId,
        sort_by: payload?.sortBy,
        skip: payload?.skip,
        limit: payload?.limit
      });
    },
    [isMountedRef]
  );

  const [filters, setFilters] = useState<Filters>({
    ipType: '',
    disabled: ''
  });

  const handleTabsChange = async (
    _event: SyntheticEvent,
    tabsValue: unknown
  ) => {
    let value = null;
    value = tabsValue;
    setPage(0);
    if (value == 'ipv4') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ipType: value,
        disabled: ''
      }));
    } else if (value == 'ipv6') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ipType: value,
        disabled: ''
      }));
    } else if (value == 'disabled') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ipType: '',
        disabled: value
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ipType: '',
        disabled: ''
      }));
    }
  };

  useEffect(() => {
    if (filters.disabled == 'disabled') {
      setCount(data?.disabledCount);
    } else if (filters.ipType == 'ipv4') {
      setCount(data?.ipv4Count);
    } else if (filters.ipType == 'ipv6') {
      setCount(data?.ipv6Count);
    } else {
      setCount(data?.workersCount);
    }
  }, [data]);

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

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property;
    setOrderBy(isAsc ? `-${property}` : property);
  };

  const createSortHandler = async (property: keyof Data) => {
    handleRequestSort(property);
  };

  useEffect(() => {
    getWorkersList({
      search: query,
      disabled: filters.disabled,
      ipType: filters.ipType,
      providerId: router.query.provider_id,
      sortBy: orderBy,
      skip: page * limit,
      limit: limit
    });
  }, [filters, limit, query, orderBy, page]);

  if (!ability.can('read', 'Workers')) {
    return <NotAuthorized />;
  }

  return (
    <>
      <Head>
        <title>Workers</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader getWorkersList={getWorkersList} />
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
            workers={data}
            providers={providers}
            getWorkersList={getWorkersList}
            handleTabsChange={handleTabsChange}
            filters={filters}
            page={page}
            limit={limit}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            query={query}
            handleQueryChange={handleQueryChange}
            createSortHandler={createSortHandler}
            orderBy={orderBy}
            count={count}
            loading={loading}
            error={error}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Workers.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Workers;
