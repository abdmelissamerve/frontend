import {
  Grid,
  Paper,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  IconButton
} from '@mui/material';
import AreaChart from '@/components/AreaChart';
import BarChart from '@/components/BarChart';
import HardwareTable from '@/content/HardwareStock/Components/HardwareTable';
import PropTypes from 'prop-types';
import StatsCard from '@/content/HardwareStock/Components/StatsCard';
import { getProviders } from '@/services/providers';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import dynamic from 'next/dynamic';

const InstallWorker = dynamic(
  () => import('src/content/HardwareStock/Components/InstallWorkerForm'),
  {
    ssr: false
  }
);

const contentProps = {
  statisticsData: PropTypes.object,
  data: PropTypes.array,
  orderBy: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  createSortHandler: PropTypes.func,
  handleQueryChange: PropTypes.func,
  handlePageChange: PropTypes.func,
  handleLimitChange: PropTypes.func,
  query: PropTypes.string,
  page: PropTypes.number,
  limit: PropTypes.number,
  count: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
  handleHardwareUpdated: PropTypes.func,
  handleTabsChange: PropTypes.func,
  filter: PropTypes.string,
  handleSingleAssignSuccess: PropTypes.func
};

type ContentProps = PropTypes.InferProps<typeof contentProps>;

function TechnicianDashboardContent({
  statisticsData,
  data,
  orderBy,
  handleQueryChange,
  query,
  count,
  handlePageChange,
  handleLimitChange,
  page,
  limit,
  createSortHandler,
  loading,
  error,
  handleHardwareUpdated,
  handleTabsChange,
  handleSingleAssignSuccess,
  filter
}: ContentProps) {
  const [workerData, setWorkerData] = useState(null);
  const [openFinishInstall, setOpenFinishInstall] = useState(false);
  const [providers, setProviders] = useState([]);

  const Box2Data = [
    {
      name: 'Installs',
      data: [2.3, 3.1, 4.0, 3.8, 5.1, 3.6, 4.0, 3.8, 5.1, 3.6, 3.2]
    }
    // {
    //   name: 'Net Loss',
    //   data: [2.1, 2.1, 3.0, 2.8, 4.0, 3.8, 5.1, 3.6, 4.1, 2.6, 1.2]
    // }
  ];

  const Box1Data = [
    {
      name: 'Installs',
      data: [32, 52, 45, 32, 54, 56, 28, 25, 36, 62]
    }
  ];

  const areaLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
    'Last Week',
    'Last Month',
    'Last Year',
    'Last Decade'
  ];

  const barLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
    'Last Week',
    'Last Month',
    'Last Year',
    'Last Decade'
  ];

  const stats = [
    {
      title: 'Assigned',
      description: 'Hardware that is assigned to you',
      value: statisticsData?.total_stock
    },
    {
      title: 'Free',
      description: 'Hardware that can be assigned',
      value: statisticsData?.free_stock
    },
    {
      title: 'Pending',
      description: 'Hardware that is in installation',
      value: statisticsData?.pending_stock
    },
    {
      title: 'Installed',
      description: 'Hardware that is installed',
      value: statisticsData?.installed_stock
    }
  ];

  const handleCreateWorkerOpen = async (data: object) => {
    const providersList = await getProviders({
      search: '',
      sort_by: '',
      skip: 0,
      limit: 1000
    });
    setWorkerData(data);
    setProviders(providersList);
    setOpenFinishInstall(true);
  };

  const handleCreateWorkerClose = (reason) => {
    if (reason && reason == 'backdropClick') {
      return;
    }
    handleHardwareUpdated({});
    setOpenFinishInstall(false);
  };

  return (
    <>
      <Grid container gap={3} paddingX={3} marginBottom={3} wrap="nowrap">
        {/* <Grid item xs={12} lg={6}> */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <AreaChart
              width={'49%'}
              height={'75px'}
              data={Box1Data}
              labels={areaLabels}
            />
            <BarChart
              width={'49%'}
              height={'75px'}
              data={Box2Data}
              labels={barLabels}
            />
          </Box>
          <Paper
            sx={{
              mt: 2,
              overflowX: 'auto',
              width: '100%'
            }}
          >
            <Box px={3} pt={2}>
              <Typography variant={'h4'}>Hardware</Typography>
              <Typography variant={'subtitle2'}>
                This is the list of available hardware that you can assign to
                yourself
              </Typography>
            </Box>
            <Grid container spacing={3} sx={{ marginTop: 0, paddingX: 2 }}>
              {stats.map((stat) => (
                <Grid key={stat.title} item xs={12} md={3}>
                  <StatsCard
                    title={stat.title}
                    description={stat.description}
                    value={stat.value}
                    selectedStat={filter}
                    handleChangeStat={handleTabsChange}
                  />
                </Grid>
              ))}
            </Grid>
            {/* <AvailableHardwareTable /> */}
            <HardwareTable
              data={data}
              createSortHandler={createSortHandler}
              handleQueryChange={handleQueryChange}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
              page={page}
              limit={limit}
              orderBy={orderBy}
              query={query}
              count={count}
              // handleOpenEdit={handleOpenEdit}
              handleOpenFinishInstall={handleCreateWorkerOpen}
              // handleOpenDelete={handleOpenDelete}
              handleSingleAssignSuccess={handleSingleAssignSuccess}
              loading={loading}
              error={error}
            />
          </Paper>
        </Grid>
        {/* <Grid item xs={12} lg={4}>
          <PendingReportCard />

          <Box sx={{ marginTop: 3 }}>
            <PendingReportCard />
          </Box>
        </Grid> */}
      </Grid>

      {/* FINISH INSTALL HARDWARE FORM*/}
      <Dialog
        fullWidth
        maxWidth="md"
        disableEscapeKeyDown
        open={openFinishInstall}
        onClose={handleCreateWorkerClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCreateWorkerClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom>
            {'Add a new worker'}
          </Typography>
          <Typography variant="subtitle2">
            {
              'Fill in the fields below to create and add a new worker to the site'
            }
          </Typography>
        </DialogTitle>
        <InstallWorker
          initialData={workerData}
          onClose={handleCreateWorkerClose}
          providers={providers}
        />
      </Dialog>
    </>
  );
}

TechnicianDashboardContent.propTypes = contentProps;

export default TechnicianDashboardContent;
