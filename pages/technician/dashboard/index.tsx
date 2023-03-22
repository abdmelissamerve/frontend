import Head from 'next/head';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from '@/content/Technician/Dashboard/PageHeader';
import ExtendedSidebarLayout from '@/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import TechnicianDashboardContent from '@/content/Technician/Dashboard/PageContent';
import { AbilityContext } from '@/contexts/Can';
import {
  useContext,
  useState,
  useCallback,
  useEffect,
  ChangeEvent
} from 'react';
import NotAuthorized from 'pages/status/not_authorized';
import { useRefMounted } from 'src/hooks/useRefMounted';
import { useFetchData } from '@/hooks/useFetch';
import {
  getTechnicianHardware,
  getTechnicianHardwareStatistics
} from '@/services/hardware-stock';

interface Data {
  model: string;
  technician: string;
  brand: string;
  mac_address: string;
  acquisition_date: string;
  warranty_term: string;
  acquisition_price: string;
}

function TechnicianDashboard() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [orderBy, setOrderBy] = useState('model');
  const [filter, setFilter] = useState('');
  const [selectedStat, setSelectedStat] = useState('Total');
  const ability = useContext(AbilityContext);
  const isMountedRef = useRefMounted();

  const {
    data: hardwareData,
    loading: hardwareLoading,
    error: hardwareError,
    fetchData: fetchHardwareData
  } = useFetchData(getTechnicianHardware);
  const {
    data: statisticsData,
    loading: statisticsLoading,
    error: statisticsError,
    fetchData: fetchStatisticsData
  } = useFetchData(getTechnicianHardwareStatistics);

  const getStockCallback = useCallback(
    (payload: any) => {
      fetchHardwareData({
        search: payload.search || query,
        skip: payload.skip || page * limit,
        limit: payload.limit || limit,
        order_by: payload.order_by || orderBy,
        type: payload.type || filter
      });
      fetchStatisticsData({});
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
    if (!hardwareData?.worker_hardware_list?.length) {
      setPage((prevPage) => Math.max(0, prevPage - 1));
    }
  }, [hardwareData]);

  const handleTabsChange = async (tabsValue: string) => {
    let type = '';
    if (tabsValue == 'Free') type = 'free';
    if (tabsValue == 'Pending') type = 'pending';
    if (tabsValue == 'Installed') type = 'installed';
    setPage(0);
    setFilter(type);
    setSelectedStat(tabsValue);
  };

  useEffect(() => {
    getStockCallback({
      search: query,
      skip: page * limit,
      limit: limit,
      order_by: orderBy,
      type: filter
    });
  }, [limit, query, page, filter, orderBy]);

  if (!ability.can('read', 'Technician-Dashboard')) {
    return <NotAuthorized />;
  }

  return (
    <>
      <Head>
        <title>Technician - Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <TechnicianDashboardContent
        statisticsData={statisticsData}
        data={hardwareData?.worker_hardware_list}
        page={page}
        limit={limit}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        query={query}
        handleQueryChange={handleQueryChange}
        createSortHandler={createSortHandler}
        orderBy={orderBy}
        count={hardwareData?.total_count}
        loading={hardwareLoading}
        error={hardwareError}
        handleHardwareUpdated={getStockCallback}
        handleTabsChange={handleTabsChange}
        filter={selectedStat}
        handleSingleAssignSuccess={getStockCallback}
      />
    </>
  );
}

TechnicianDashboard.getLayout = (page) => {
  return (
    <Authenticated>
      <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
  );
};

export default TechnicianDashboard;
