import {
  FC,
  ChangeEvent,
  MouseEvent,
  SyntheticEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useRef
} from 'react';
import { useRefMounted } from 'src/hooks/useRefMounted';
import { useEffect, useCallback } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { wait } from 'src/utils/wait';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
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
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  Collapse,
  TableSortLabel,
  Link
} from '@mui/material';

import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { Provider } from 'src/types/providers';
import { useTranslation } from 'react-i18next';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useSnackbar } from 'notistack';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { updateProvider, deleteProvider } from '@/services/providers';
import { getProviderLocations } from '@/services/providerLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationResults from './ProviderLocation';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Description } from '@mui/icons-material';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  deleteObject
} from 'firebase/storage';

const ProviderForm = dynamic(() => import('./AddProviderForm'), {
  ssr: false
});

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const CardWrapper = styled(Card)(
  ({ theme }) => `

  position: relative;
  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: inherit;
    z-index: 1;
    transition: ${theme.transitions.create(['box-shadow'])};
  }
      
    &.Mui-selected::after {
      box-shadow: 0 0 0 3px ${theme.colors.primary.main};
    }
  `
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
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
  providers: Provider[];
  getProvidersList: Function;
  page: any;
  limit: any;
  handlePageChange: Function;
  handleLimitChange(event: ChangeEvent<HTMLInputElement>);
  handleQueryChange: Function;
  createSortHandler: Function;
  orderBy: any;
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
  providers,
  getProvidersList,
  page,
  limit,
  handleLimitChange,
  handlePageChange,
  handleQueryChange,
  createSortHandler,
  orderBy,
  loading,
  error
}) => {
  const [selectedItems, setSelectedProviders] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const isMountedRef = useRefMounted();
  const selectedBulkActions = selectedItems.length > 0;
  const [openConfirmEdit, setopenConfirmEdit] = useState(false);
  const [openProvLocation, setOpenProvLocation] = useState(false);
  const [providerLocation, setProviderLocation] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [provider, setProvider] = useState(null);
  const [percent, setPercent] = useState(0);
  const [path, setPath] = useState('');
  const [url, setUrl] = useState('');
  const [providerValues, setProviderValues] = useState({
    id: '',
    name: '',
    website: '',
    loginUrl: '',
    affiliateUrl: '',
    description: '',
    services: '',
    logo: '',
    statistics: [
      {
        number: '',
        label: ''
      }
    ],
    published: null
  });
  const handleViewLocations = async (provider) => {
    try {
      const providerLocations = await getProviderLocations(provider.id);
      if (isMountedRef()) {
        setOpenProvLocation(true);
        setProviderLocation(providerLocations);
        setProvider(provider);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeProviderLocations = () => {
    setOpenProvLocation(false);
  };

  const handleEditProvider = (provider) => {
    setProviderValues({
      id: provider.id,
      name: provider.name,
      website: provider.site,
      loginUrl: provider.loginLink,
      affiliateUrl: provider.affiliateLink,
      description: provider.description,
      services: provider.services,
      logo: provider.logo,
      published: provider.published
        ? { value: true, label: 'Yes' }
        : { value: false, label: 'No' },
      statistics: provider.statistics ? provider.statistics : []
    });
    setopenConfirmEdit(true);
  };
  const closeProviderEdit = () => {
    setopenConfirmEdit(false);
  };

  const handleEditProviderSuccess = () => {
    enqueueSnackbar(t('The provider was edited successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom,
      autoHideDuration: 2000
    });

    setOpen(false);
  };

  const handleOpenDelete = (provider) => {
    setProvider(provider);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    try {
      await deleteProvider(provider.id);
      await getProvidersList({
        search: '',
        sortBy: orderBy,
        skip: page * limit,
        limit: limit
      });
      setOpenConfirmDelete(false);
      enqueueSnackbar(t('The provider has been removed'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    } catch (error) {
      setOpenConfirmDelete(false);
      enqueueSnackbar(error.data.detail, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
  };

  const submitProvider = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const data = {
        name: _values.name,
        site: _values.website,
        login_link: _values.loginUrl,
        affiliate_link: _values.affiliateUrl,
        description: _values.description,
        services: _values.services,
        logo: _values.logo ? _values.logo : url,
        password: _values.password,
        page_published:
          typeof _values.published == 'boolean'
            ? _values.published
            : _values.published.value,
        statistics: {
          statistics: _values.statistics
        }
      };
      await updateProvider(data, providerValues.id);
      await getProvidersList({
        search: '',
        sortBy: orderBy,
        skip: page * limit,
        limit: limit
      });
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
      handleEditProviderSuccess();
      setopenConfirmEdit(false);
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const router = useRouter();
  const viewWorkers = async (providerId) => {
    router.push({
      pathname: '/workers',
      search: `?provider_id=${providerId}`
    });
  };

  interface Data {
    id: number;
    name: string;
    site: string;
    login_link: string;
    affiliate_link: string;
    worker_count: number;
    location_count: number;
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
      id: 'name',
      label: 'Name'
    },
    {
      id: 'login_link',
      label: 'Login Url'
    },
    {
      id: 'worker_count',
      label: 'Workers Count'
    },

    {
      id: 'location_count',
      label: 'Locations Count'
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

  const handleFileUpload = (name, file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `/logo/${name}`);
    setPath(`/logo/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUrl(url);
        });
      }
    );
  };

  const handleFileDelete = (path) => {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    deleteObject(storageRef)
      .then(() => {
        console.log('file removed');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <LocationResults
        updateLocationList={handleViewLocations}
        providersLocation={providerLocation}
        provider={provider}
        openDialog={openProvLocation}
        closeDialog={closeProviderLocations}
      />
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
        {providers?.length === 0 ? (
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
              {loading
                ? 'Loading...'
                : 'There is no data mathing your search criteria.'}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? 'asc' : false}
                      >
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? 'asc' : 'desc'}
                          onClick={() => createSortHandler(headCell.id)}
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          {headCell.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {providers?.map((provider) => {
                    const isProviderSelected = selectedItems.includes(
                      provider.id
                    );
                    return [
                      <TableRow
                        hover
                        key={provider.id}
                        selected={isProviderSelected}
                      >
                        <TableCell>
                          <Typography>{provider.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Link href={provider.site} variant="h5">
                            {provider.name}
                          </Link>
                        </TableCell>

                        <TableCell>
                          <Link href={provider.loginLink} color="inherit">
                            {provider.loginLink}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => viewWorkers(provider.id)}
                            style={{ backgroundColor: 'transparent' }}
                          >
                            <Typography>{provider.workerCount}</Typography>
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Typography>{provider.locationCount}</Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography noWrap>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                onClick={() => handleEditProvider(provider)}
                                color="primary"
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('View Locations')} arrow>
                              <IconButton
                                onClick={() => handleViewLocations(provider)}
                                color="primary"
                              >
                                <LocationOnIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() => handleOpenDelete(provider)}
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ];
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={-1}
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

      <Dialog
        open={openConfirmEdit}
        fullWidth
        maxWidth="md"
        onClose={closeProviderEdit}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Edit provider fields')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to edit the provider')}
          </Typography>
        </DialogTitle>
        <ProviderForm
          addProvider={submitProvider}
          handleCancel={closeProviderEdit}
          initialData={providerValues}
          handleFileDelete={handleFileDelete}
          handleFileUpload={handleFileUpload}
          path={path}
        />
      </Dialog>

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
            {t('Are you sure you want to permanently delete this provider')}?
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
            <ButtonError
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
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

Results.propTypes = {
  providers: PropTypes.array
};

Results.defaultProps = {
  providers: []
};

export default Results;
