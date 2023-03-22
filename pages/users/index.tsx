import {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  ChangeEvent,
  useContext
} from 'react';

import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Users/PageHeader';
import Footer from 'src/components/Footer';

import { Grid, Button } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import type { User } from 'src/models/user';

import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/Users/Results';
import { getUsers } from 'src/services/users';
import { useFetchData } from '@/hooks/useFetch';
import { AbilityContext } from '@/contexts/Can';
import NotAuthorized from '../status/not_authorized';

interface Filters {
  role?: string;
  active?: boolean;
}

function ManagementUsers() {
  const isMountedRef = useRefMounted();
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState<string>('');
  const { data, loading, error, fetchData } = useFetchData(getUsers);

  const [filters, setFilters] = useState<Filters>({
    role: '',
    active: false
  });
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const ability = useContext(AbilityContext);

  const getUsersList = useCallback(
    (data: any) => {
      fetchData({
        search: data.search,
        role: data.role,
        is_active: data.is_active,
        skip: data.skip,
        limit: data.limit
      });
    },
    [isMountedRef]
  );

  const handleTabsChange = async (
    _event: SyntheticEvent,
    tabsValue: unknown
  ) => {
    let value = null;
    value = tabsValue;
    setPage(0);
    if (value != 'all' && value == 'active') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        role: '',
        active: true
      }));
    } else if (value != 'all' && value != 'active') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        role: value,
        active: false
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        role: '',
        active: false
      }));
    }
  };

  useEffect(() => {
    getUsersList({
      search: query,
      role: filters.role,
      is_active: filters.active,
      skip: limit * page,
      limit: limit
    });
  }, [filters, limit, query, page]);

  useEffect(() => {
    if (!data?.length) {
      setPage((prevPage) => Math.max(0, prevPage - 1));
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

  if (!ability.can('read', 'Users')) {
    return <NotAuthorized />;
  }

  return (
    <>
      <Head>
        <title>Users - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          getUsersList={getUsersList}
          filters={filters}
          limit={limit}
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
            users={data}
            getUsersList={getUsersList}
            handleTabsChange={handleTabsChange}
            filters={filters}
            page={page}
            limit={limit}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            query={query}
            handleQueryChange={handleQueryChange}
            loading={loading}
            error={error}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementUsers.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementUsers;
