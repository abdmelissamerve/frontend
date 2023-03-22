import {
  FC,
  ChangeEvent,
  MouseEvent,
  SyntheticEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useEffect,
  useRef
} from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  Slide,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Tabs,
  TextField,
  Button,
  Typography,
  Dialog,
  Zoom,
  styled,
  Tooltip,
  IconButton,
  DialogTitle,
  CircularProgress,
  Tab,
  TableSortLabel
} from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from 'react-i18next';
import BulkActions from './BulkActions';
import CloseIcon from '@mui/icons-material/Close';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useSnackbar } from 'notistack';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { deleteWorker, updateWorker, deployWorker } from '@/services/workers';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dynamic from 'next/dynamic';
import { LockOpen } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';

const EditWorkerForm = dynamic(() => import('./EditWorkerForm'), {
  ssr: false
});
const SSHTerminal = dynamic(() => import('@/components/Terminal/sshTerminal'), {
  ssr: false
});

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const TabsWrapper = styled(Tabs)(
  ({ theme }) => `
    @media (max-width: ${theme.breakpoints.values.md}px) {
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          box-shadow: none;
      }
    }
    `
);

interface ResultsProps {
  workers: any;
  providers: any;
  getWorkersList: Function;
  handleTabsChange: Function;
  filters: any;
  page: any;
  limit: any;
  handlePageChange: Function;
  handleLimitChange(event: ChangeEvent<HTMLInputElement>);
  handleQueryChange: Function;
  createSortHandler: Function;
  orderBy: any;
  query: any;
  count: any;
  loading: boolean;
  error: any;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Results: FC<ResultsProps> = ({
  workers,
  providers,
  getWorkersList,
  filters,
  handleTabsChange,
  page,
  limit,
  handleLimitChange,
  handlePageChange,
  handleQueryChange,
  query,
  createSortHandler,
  orderBy,
  count,
  loading,
  error
}) => {
  const router = useRouter();
  const [selectedItems, setSelectedWorkers] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const selectedBulkActions = selectedItems.length > 0;
  const [toggleView, setToggleView] = useState<string | null>('table_view');
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openConfirmDisable, setOpenConfirmDisable] = useState(false);
  const [workerData, setWorkerData] = useState(null);
  const [editWorker, setEditWorker] = useState(false);
  const [sshWorker, setSShWorker] = useState({ open: false, worker: null });
  const [deployWorkerBool, setDeployWorkerBool] = useState(false);
  const [workerAction, setWorkerAction] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const handleOpenEditWorker = (worker) => {
    setWorkerData({
      currency: { label: worker.currency, value: worker.currency },
      id: worker.id,
      ipv4: worker.ipv4,
      ipv6: worker.ipv6,
      payment_date: worker.paymentDate,
      payment_recurrence: {
        label: worker.paymentRecurrence,
        value: worker.paymentRecurrence
      },
      port: worker.port,
      price: worker.price,
      latitude: worker.latitude,
      longitude: worker.longitude,
      provider: { name: worker.providerData.name, id: worker.providerData.id },
      provider_location: {
        id: worker.location.id,
        city: worker.location.city,
        continent: worker.location.continent,
        country: worker.location.country,
        data_center: worker.location.data_center
      }
    });

    setEditWorker(true);
  };

  const handleCloseEditWorker = () => {
    setEditWorker(false);
  };

  const handleConfirmDelete = (worker) => {
    setWorkerData(worker);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleOpenDisable = (worker, action) => {
    setWorkerData(worker);
    setWorkerAction(action);
    setOpenConfirmDisable(true);
  };

  const handleCloseDisable = () => {
    setOpenConfirmDisable(false);
  };

  const confirmAction = async () => {
    await updateWorker({ disabled: workerAction }, workerData.id);
    setOpenConfirmDisable(false);
    await getWorkersList({
      search: query,
      disabled: filters.disabled,
      ipType: filters.ipType,
      providerId: router.query.provider_id,
      sortBy: orderBy,
      skip: 0,
      limit: limit
    });
  };

  const handleDeleteCompleted = async () => {
    await deleteWorker(workerData.id);
    await getWorkersList({
      search: query,
      disabled: filters.disabled,
      ipType: filters.ipType,
      providerId: router.query.provider_id,
      sortBy: orderBy,
      skip: page * limit,
      limit: limit
    });
    setOpenConfirmDelete(false);
    enqueueSnackbar(t('The worker has been removed'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom,
      autoHideDuration: 1000
    });
  };

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      let data: any = {
        id: _values.id,
        ipv4: _values.ipv4,
        ipv6: _values.ipv6,
        port: _values.port,
        payment_date: _values.payment_date,
        payment_recurrence: _values.payment_recurrence.label,
        currency: _values.currency.label,
        price: _values.price,
        provider_location_id: _values.provider_location.id
      };
      if (_values.password !== '') {
        data = { ...data, password: _values.password };
      }
      await updateWorker(data, workerData.id);
      await getWorkersList();
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
      handleCreateWorkerSuccess();
      setEditWorker(false);
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const handleCreateWorkerSuccess = () => {
    enqueueSnackbar(t('The worker was edited successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom,
      autoHideDuration: 1000
    });
  };

  const handleSSHWorker = (worker: any) => {
    setSShWorker({ open: true, worker: worker });
  };

  const handleCloseSSHWorker = () => {
    setSShWorker({ open: false, worker: null });
  };

  const handleDeployWorker = async (worker) => {
    try {
      setWorkerData(worker);
      setDeployWorkerBool(true);
      await deployWorker(worker.id);
      enqueueSnackbar(t('The worker was deployed successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom,
        autoHideDuration: 2000
      });
      setDeployWorkerBool(false);
    } catch (e) {
      let err;
      setDeployWorkerBool(false);
      if (e.kind == 'timeout') {
        err = 'Request timeout. Please try again later.';
      } else {
        err = 'An error has occured. Please try again later. ';
      }
      enqueueSnackbar(err, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom,
        autoHideDuration: 2000
      });
      console.log(e);
    }
  };

  const tabs = [
    {
      value: 'all',
      label: t(`All workers (${workers?.workersCount})`)
    },
    {
      value: 'ipv4',
      label: t(`Only IPv4 (${workers?.ipv4Count})`)
    },
    {
      value: 'ipv6',
      label: t(`IPv6 (${workers?.ipv6Count})`)
    },
    {
      value: 'disabled',
      label: t(`Disabled (${workers?.disabledCount})`)
    }
  ];

  interface Data {
    id: number;
    port: number;
    provider: string;
    continent: string;
    country: string;
    city: string;
    data_center: string;
    ipv4: string;
    private_ipv4: string;
    ipv6: string;
    asn: string;
    coordinates: string;
    paymentDate: string;
    paymentRecurrence: string;
    price: number;
    currency: string;
    actions: string;
  }

  interface HeadCell {
    id: keyof Data;
    label: string;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: 'id',
      label: 'ID'
    },
    {
      id: 'port',
      label: 'Port'
    },
    {
      id: 'provider',
      label: 'Provider'
    },
    {
      id: 'continent',
      label: 'Continent'
    },
    {
      id: 'country',
      label: 'Country'
    },
    {
      id: 'city',
      label: 'City'
    },
    {
      id: 'data_center',
      label: 'Data Center'
    },
    {
      id: 'ipv4',
      label: 'IPv4'
    },
    {
      id: 'ipv6',
      label: 'IPv6'
    },
    {
      id: 'private_ipv4',
      label: 'Private IPv4'
    },
    {
      id: 'asn',
      label: 'Asn'
    },
    {
      id: 'coordinates',
      label: 'Coordinates'
    },
    {
      id: 'paymentDate',
      label: 'Payment Date'
    },
    {
      id: 'paymentRecurrence',
      label: 'Payment Recurrence'
    },
    {
      id: 'price',
      label: 'Price'
    },
    {
      id: 'currency',
      label: 'Currency'
    },
    {
      id: 'actions',
      label: 'Actions'
    }
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(
      () => handleQueryChange(event.target.value),
      500
    );
  };

  if (error) {
    return (
      <Typography
        sx={{
          py: 10
        }}
        variant="h3"
        fontWeight="normal"
        color="text.secondary"
        align="center"
      >
        An error has occurred, please try again later.
      </Typography>
    );
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
        pb={3}
      >
        <TabsWrapper
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="secondary"
          value={filters.ipType || filters.disabled || 'all'}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </TabsWrapper>
      </Box>

      {toggleView === 'table_view' && (
        <Card>
          <Box p={2}>
            {!selectedBulkActions && (
              <TextField
                sx={{
                  m: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleSearch}
                placeholder={t('Search by country, city or data center...')}
                size="small"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
            {selectedBulkActions && <BulkActions />}
          </Box>

          <Divider />

          {workers?.workers.length == 0 ? (
            <>
              <Typography
                sx={{
                  py: 10
                }}
                variant="h3"
                fontWeight="normal"
                color="text.secondary"
                align="center"
              >
                There is no data mathing your search criteria.
              </Typography>
            </>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(235, 235, 235, 0.5)',
                      width: '100%',
                      height: '100%',
                      display: loading ? 'flex' : 'none',
                      justifyContent: 'center',
                      alignItems: 'center'
                      // opacity: 0.2
                    }}
                  >
                    <CircularProgress />
                  </Box>
                  <TableHead>
                    <TableRow>
                      {headCells.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          sortDirection={
                            orderBy === headCell.id ? 'asc' : false
                          }
                        >
                          {headCell.id == 'provider' ||
                          headCell.id == 'continent' ||
                          headCell.id == 'country' ||
                          headCell.id == 'city' ||
                          headCell.id == 'data_center' ||
                          headCell.id == 'id' ||
                          headCell.id == 'price' ? (
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={
                                orderBy === headCell.id ? 'asc' : 'desc'
                              }
                              onClick={() => createSortHandler(headCell.id)}
                              sx={{ whiteSpace: 'nowrap' }}
                            >
                              {headCell.label}
                            </TableSortLabel>
                          ) : (
                            <Typography>{headCell.label}</Typography>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workers?.workers.map((worker) => {
                      return (
                        <TableRow
                          hover
                          key={worker.id}
                          style={{
                            background: worker.disabled == true ? '#FED8D8' : ''
                          }}
                        >
                          <TableCell>
                            <Typography>{worker.id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.port}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.provider}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.continent}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.country}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.city}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.dataCenter}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.ipv4}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.ipv6}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.private_ipv4}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.asn}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip
                              title={`Longitude: ${worker.longitude}, Latitude: ${worker.latitude}`}
                              arrow
                            >
                              <IconButton
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `Longitude: ${worker.longitude}, Latitude: ${worker.latitude}`
                                  );
                                }}
                                color="primary"
                              >
                                <LocationOnIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.paymentDate}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.paymentRecurrence}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.price}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{worker.currency}</Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() => handleOpenEditWorker(worker)}
                                  color="primary"
                                  size="small"
                                >
                                  <LaunchTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(worker)}
                                  color="primary"
                                >
                                  <DeleteTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Connect with SSH')} arrow>
                                <IconButton
                                  onClick={() => handleSSHWorker(worker)}
                                  color="primary"
                                  size="small"
                                >
                                  <TerminalIcon />
                                </IconButton>
                              </Tooltip>
                              {deployWorkerBool &&
                              worker.id == workerData.id ? (
                                <CircularProgress size="1rem" />
                              ) : (
                                <Tooltip title={t('Deploy')} arrow>
                                  <IconButton
                                    onClick={() => handleDeployWorker(worker)}
                                    color="primary"
                                    size="small"
                                  >
                                    <Typography>Deploy</Typography>
                                  </IconButton>
                                </Tooltip>
                              )}
                              {worker.disabled == true ? (
                                <Tooltip title={t('Enable')} arrow>
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() =>
                                      handleOpenDisable(worker, false)
                                    }
                                  >
                                    <LockOpen fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title={t('Disable')} arrow>
                                  <IconButton
                                    onClick={() =>
                                      handleOpenDisable(worker, true)
                                    }
                                    color="primary"
                                    size="small"
                                  >
                                    <LockIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box p={2}>
                <TablePagination
                  component="div"
                  count={count}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[25, 50, 100]}
                />
              </Box>
            </>
          )}
        </Card>
      )}
      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
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
          >
            {t('Are you sure you want to permanently delete this worker')}?
          </Typography>

          <Box>
            <Button
              variant="text"
              size="small"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleDeleteCompleted}
              size="small"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="outlined"
              color="error"
            >
              {t('Delete')}
            </Button>
          </Box>
        </Box>
      </DialogWrapper>

      <DialogWrapper
        open={openConfirmDisable}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDisable}
      >
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
          >
            {t('Are you sure you want to disable this worker?')}?
          </Typography>

          <Box>
            <Button
              variant="text"
              size="small"
              sx={{
                mx: 1
              }}
              onClick={handleCloseDisable}
            >
              {t('Cancel')}
            </Button>
            {workerAction == true ? (
              <Button
                onClick={confirmAction}
                size="small"
                sx={{
                  mx: 1,
                  px: 3
                }}
                variant="outlined"
                color="error"
              >
                {t('Disable')}
              </Button>
            ) : (
              <Button
                onClick={confirmAction}
                size="small"
                sx={{
                  mx: 1,
                  px: 3
                }}
                variant="outlined"
                color="primary"
              >
                {t('Enable')}
              </Button>
            )}
          </Box>
        </Box>
      </DialogWrapper>

      {/* SSH dialog */}
      {sshWorker.open && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={sshWorker.open}
          onClose={handleCloseSSHWorker}
        >
          <DialogTitle
            sx={{
              p: 3
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleCloseSSHWorker}
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
              {t('SSH in worker: ')} {sshWorker.worker.ipv4}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('ID')}</TableCell>
                      <TableCell>{t('IPv4')}</TableCell>
                      <TableCell>{t('IPv6')}</TableCell>
                      <TableCell>{t('City')}</TableCell>
                      <TableCell>{t('Country')}</TableCell>
                      <TableCell>{t('Continent')}</TableCell>
                      <TableCell>{t('Data Center')}</TableCell>
                      <TableCell>{t('Provider')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow hover>
                      <TableCell>{sshWorker.worker.id}</TableCell>
                      <TableCell>{sshWorker.worker.ipv4}</TableCell>
                      <TableCell>{sshWorker.worker.ipv6}</TableCell>
                      <TableCell>{sshWorker.worker.location.city}</TableCell>
                      <TableCell>{sshWorker.worker.location.country}</TableCell>
                      <TableCell>
                        {sshWorker.worker.location.continent}
                      </TableCell>
                      <TableCell>
                        {sshWorker.worker.location.data_center}
                      </TableCell>
                      <TableCell>
                        {sshWorker.worker.location.provider.name}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </DialogTitle>
          <SSHTerminal workerId={sshWorker.worker.id} />
        </Dialog>
      )}

      {/* Edit worker dialog */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={editWorker}
        onClose={handleCloseEditWorker}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Add a new worker')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'Fill in the fields below to create and add a new worker to the site'
            )}
          </Typography>
        </DialogTitle>
        <EditWorkerForm
          handleFormSubmit={handleFormSubmit}
          handleCancel={handleCloseEditWorker}
          providers={providers}
          initialData={workerData}
        />
      </Dialog>
    </>
  );
};

Results.propTypes = {
  workers: PropTypes.object.isRequired
};

Results.defaultProps = {
  workers: {
    workersCount: 0,
    disabledCount: 0,
    ipv4Count: 0,
    ipv6Count: 0,
    workers: []
  }
};

export default Results;
