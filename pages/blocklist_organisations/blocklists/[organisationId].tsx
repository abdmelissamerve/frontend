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
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import PageHeader from 'src/content/Services/Blocklist/PageHeader';
import Results from 'src/content/Services/Blocklist/Results';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import * as blocklistService from 'src/services/blocklist';
import { useFetchData } from '@/hooks/useFetch';

interface Filters {
  type: string;
  is_disabled: boolean;
}

function ManagementBlocklists() {
  const isMountedRef = useRefMounted();
  const ability = useContext(AbilityContext);
  const router = useRouter();
  const { data, loading, error, fetchData } = useFetchData(
    blocklistService.getBlockLists
  );
  const [filters, setFilters] = useState<Filters>({
    type: '',
    is_disabled: null
  });
  const getBlocklistsList = useCallback(
    (data: any) => {
      fetchData({
        search: data.search,
        order_by: data.order_by,
        search_type: data.search_type,
        skip: data.skip,
        limit: data.limit,
        is_disabled: data.is_disabled,
        orgId: router.query.organisationId
      });
    },
    [isMountedRef]
  );

  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);

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

  const handleTabsChange = async (
    _event: SyntheticEvent,
    tabsValue: unknown
  ) => {
    let value = null;
    value = tabsValue;
    setPage(0);
    if (value == 'is_disabled') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        type: '',
        is_disabled: true
      }));
    } else if (value == 'all') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        type: '',
        is_disabled: null
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        type: value,
        is_disabled: null
      }));
    }
  };

  interface Data {
    id: string;
    domain: string;
    ipv4: string;
    ipv6: string;
    dom: string;
    response: string;
    description: string;
    actions: string;
  }

  const [orderBy, setOrderBy] = useState('');

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property;
    setOrderBy(isAsc ? `-${property}` : property);
  };

  const createSortHandler = async (property: keyof Data) => {
    handleRequestSort(property);
  };

  useEffect(() => {
    getBlocklistsList({
      search: query,
      order_by: orderBy,
      search_type: filters.type,
      skip: page * limit,
      limit: limit,
      is_disabled: filters.is_disabled
    });
  }, [limit, orderBy, query, page, filters]);

  if (!ability.can('read', 'Blocklist-Organisation')) {
    return <NotAuthorized />;
  }

  return (
    <>
      <Head>
        <title>Blocklists - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          getBlocklists={getBlocklistsList}
          limit={limit}
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
            getBlocklists={getBlocklistsList}
            handleQueryChange={handleQueryChange}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            page={page}
            limit={limit}
            orderBy={orderBy}
            createSortHandler={createSortHandler}
            handleTabsChange={handleTabsChange}
            filters={filters}
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
