import {
  Typography,
  Box,
  Button,
  DialogTitle,
  Divider,
  Dialog,
  Grid,
  Paper
} from '@mui/material';
import dynamic from 'next/dynamic';

import HardwareTable from '@/content/HardwareStock/Components/HardwareTable';
import { useState } from 'react';
import EditHardwareForm from '@/content/HardwareStock/Components/EditHardwareForm';
import AssignHardwareForm from '@/content/HardwareStock/Components/AssignHardwareForm';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import PropTypes from 'prop-types';
import StatsCard from './Components/StatsCard';
import { deleteWorkerHardware } from '@/services/hardware-stock';
import { useSnackbar, VariantType } from 'notistack';
// import InstallWorker from './Components/InstallWorkerForm';
import { getProviders } from '@/services/providers';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const InstallWorker = dynamic(() => import('./Components/InstallWorkerForm'), {
  ssr: false
});

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

function HardwareContent({
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
  const { enqueueSnackbar } = useSnackbar();
  const [workerData, setWorkerData] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openFinishInstall, setOpenFinishInstall] = useState(false);

  const [hardwareData, setHardwareData] = useState({});
  const [openAssign, setOpenAssign] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [providers, setProviders] = useState([]);

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

  const stats = [
    {
      title: 'Total',
      description: 'Hardware that can be assigned',
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

  const handleSnackbar = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, {
      variant: variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 2000
    });
  };

  const handleOpenDelete = (data: object) => {
    setHardwareData(data);
    setOpenDelete(true);
    setOpenDeleteConfirmation(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleOpenEdit = (data: object) => {
    setHardwareData(data);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleOpenAssign = () => {
    setOpenAssign(true);
  };

  const handleCloseAssign = () => {
    setOpenAssign(false);
  };

  const handleSuccessEdit = () => {
    setOpenEdit(false);
    handleHardwareUpdated({});
    handleSnackbar('Hardware updated successfully', 'success');
  };

  const handleAssignSuccess = () => {
    setOpenAssign(false);
    handleHardwareUpdated({});
    handleSnackbar('Hardware assigned successfully', 'success');
  };

  const handleDeleteCompleted = async () => {
    try {
      await deleteWorkerHardware(hardwareData.id);
      handleCloseDelete();
      handleHardwareUpdated({});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Typography variant={'h4'}>
          This is a list of all the Hardware available
        </Typography>
        <Button
          variant={'contained'}
          color={'primary'}
          type={'button'}
          onClick={handleOpenAssign}
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Assign Hardware
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ marginTop: 0 }}>
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

      <Paper
        sx={{ mt: 2, overflowX: 'auto', width: '100%', height: '100%', mb: 10 }}
      >
        {/*    HARDWARE TABLE    */}
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
          handleOpenEdit={handleOpenEdit}
          handleOpenFinishInstall={handleCreateWorkerOpen}
          handleOpenDelete={handleOpenDelete}
          handleSingleAssignSuccess={handleSingleAssignSuccess}
          loading={loading}
          error={error}
        />
      </Paper>

      {/* EDIT HARDWARE FORM*/}
      <Dialog fullWidth maxWidth="md" open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography data-cy="add-stck-form-title" variant="h4" gutterBottom>
            {'Edit Hardware'}
          </Typography>
          <Typography data-cy="add-stock-form-subtitle" variant="subtitle2">
            {'Fill in the fields below to edit Hardware.'}
          </Typography>
        </DialogTitle>
        <Divider />
        <Box sx={{ p: 3 }}>
          <EditHardwareForm
            data={hardwareData}
            handleHardwareUpdated={handleSuccessEdit}
          />
        </Box>
      </Dialog>

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

      {/*  ASSIGN HARDWARE DIALOG  */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openAssign}
        onClose={handleCloseAssign}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography data-cy="add-stck-form-title" variant="h4" gutterBottom>
            {'Assing Hardware'}
          </Typography>
          <Typography data-cy="add-stock-form-subtitle" variant="subtitle2">
            {'Fill in the fields below to assign hardware.'}
          </Typography>
        </DialogTitle>
        <Divider />
        <Box sx={{ p: 3 }}>
          <AssignHardwareForm handleAssignSuccess={handleAssignSuccess} />
        </Box>
      </Dialog>

      {/*  DELETE HARDWARE DIALOG  */}
      <Dialog
        open={openDelete}
        maxWidth="sm"
        fullWidth
        onClose={handleCloseDelete}
      >
        {openDeleteConfirmation ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            p={5}
          >
            <Typography
              align="center"
              sx={{
                py: 4,
                px: 6
              }}
              variant="h4"
              dta-cy="delete-assurance-text"
            >
              {hardwareData?.technician && hardwareData?.worker
                ? 'A worker and a technician have been assigned to this hardware. Are you sure you want to confirm deletion? This operation will also delete the assigned worker!'
                : hardwareData?.worker
                ? 'A worker has been assigned to this hardware. Are you sure you want to confirm deletion? This operation will also delete the assigned worker!'
                : hardwareData?.technician
                ? 'A technician has been assigned to this hardware. Are you sure you want to confirm deletion?'
                : 'Are you sure you want to confirm deletion?'}
            </Typography>
            <Box>
              <Button
                onClick={handleDeleteCompleted}
                size="small"
                sx={{
                  mx: 1,
                  px: 3
                }}
                variant="contained"
                color="error"
                data-cy="delete-button-final"
              >
                CONFIRM
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            p={5}
          >
            <Typography
              align="center"
              sx={{
                py: 4,
                px: 6
              }}
              variant="h4"
              dta-cy="delete-assurance-text"
            >
              Are you sure you want to permanently delete this worker hardware?
            </Typography>
            <Box>
              <Button
                variant="text"
                size="small"
                sx={{
                  mx: 1
                }}
                onClick={handleCloseDelete}
                data-cy="cancel-button-delete-final"
              >
                CANCEL
              </Button>
              <Button
                onClick={() => setOpenDeleteConfirmation(true)}
                size="small"
                sx={{
                  mx: 1,
                  px: 3
                }}
                variant="outlined"
                color="error"
                data-cy="delete-button-final"
              >
                YES
              </Button>
            </Box>
          </Box>
        )}
      </Dialog>
    </>
  );
}

HardwareContent.propTypes = contentProps;

export default HardwareContent;
