import React, {
  FC,
  ChangeEvent,
  useRef,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useEffect,
  useCallback
} from 'react';
import {
  Box,
  Card,
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
  TextField,
  Typography,
  TableSortLabel,
  Dialog,
  styled,
  DialogTitle,
  Zoom,
  Button,
  Avatar,
  Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { getOrganisationServices } from 'src/services/services';
import { updateService, deleteService } from 'src/services/services';
import { useSnackbar } from 'notistack';
import { useRefMounted } from 'src/hooks/useRefMounted';
import dynamic from 'next/dynamic';
import { useFetchData } from '@/hooks/useFetch';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AddServiceForm = dynamic(() => import('./AddServiceForm'), {
  ssr: false
});

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
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

interface ResultsProps {
  organisationId: any;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Results: FC<ResultsProps> = ({ organisationId }) => {
  const { data, loading, error, fetchData } = useFetchData(
    getOrganisationServices
  );
  const { t }: { t: any } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEditService, setOpenEditService] = useState(false);
  const [openAddService, setOpenAddService] = useState(false);
  const isMountedRef = useRefMounted();
  const [services, setServices] = useState<any>();
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [orderBy, setOrderBy] = useState('-created_at');
  const [organisationsServices, setOrganisationsServices] = useState<any>();

  const getServices = useCallback(
    async (id: any, data: any) => {
      try {
        const response = await getOrganisationServices(id, data);
        if (isMountedRef()) {
          setServices(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMountedRef]
  );
  const { enqueueSnackbar } = useSnackbar();
  const [serviceData, setServiceData] = useState({
    id: '',
    name: '',
    type: ''
  });

  const handleOpenAddService = (service) => {
    setServiceData({
      id: service.id,
      name: service.name,
      type: service.type
    });

    setOpenAddService(true);
  };

  const handleCloseAddService = () => {
    setOpenAddService(false);
  };

  const handleCloseEditService = () => {
    setOpenEdit(false);
  };

  const handleOpenDelete = (service) => {
    setServiceData({
      id: service.id,
      name: service.name,
      type: service.type
    });
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteCompleted = async () => {
    await deleteService(organisationId, serviceData.id);
    location.reload();
    setOpenDelete(false);
    enqueueSnackbar(t('The service has been removed'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const handleOpenEditService = (service) => {
    setServiceData({
      id: service.id,
      name: service.name,
      type: service.type
    });
    setOpenEdit(true);
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

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property;
    setOrderBy(isAsc ? `-${property}` : property);
  };

  const createSortHandler = async (property: keyof Data) => {
    handleRequestSort(property);
  };

  const timeout = useRef<ReturnType<typeof setTimeout>>();

  interface Data {
    service_id: number;
    organisation_id: number;
    name: string;
    type: string;
    actions: string;
  }

  interface HeadCell {
    id: keyof Data;
    label: string;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: 'service_id',
      label: 'Service Id'
    },
    {
      id: 'organisation_id',
      label: 'Organisation Id'
    },
    {
      id: 'name',
      label: 'Name'
    },
    {
      id: 'type',
      label: 'Type'
    },
    {
      id: 'actions',
      label: 'Actions'
    }
  ];
  useEffect(() => {
    const data = {
      search: query,
      order_by: orderBy,
      skip: limit * page,
      limit: limit
    };
    setOrganisationsServices(getServices(organisationId, data));
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(
      () => handleQueryChange(event.target.value),
      500
    );
  };

  const handleFormSubmit = async (_values) => {
    try {
      const data = {
        name: _values.name,
        type: _values.type
      };
      await updateService(data, organisationId, serviceData.id);
      await getOrganisationServices(organisationId, {
        search: '',
        order_by: orderBy,
        skip: page * limit,
        limit: limit
      });
      location.reload();
    } catch (err) {
      console.error(err);
    }
  };
  const [responseList, setResponseList] = useState([]);
  const setResponseValues = (data) => {
    if (data.code !== '' && data.description !== '') {
      setResponseList((responses) => {
        return [
          ...responses,
          {
            code: data.code,
            description: data.description
          }
        ];
      });
    }
  };

  const removeResponse = (e, key) => {
    let array = [...responseList];
    array.splice(key, 1);
    setResponseList(array);
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
      <Typography
        data-cy="my-organisation-services-title"
        variant="h4"
        gutterBottom
      >
        {t('Organisation Services')}
      </Typography>
      <Card>
        <Box p={2}>
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
            placeholder={t('Search by service id, name or type')}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
            data-cy="services-search-bar"
          />
        </Box>
        <Divider />
        {organisationsServices?.length === 0 ? (
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
                : 'There is no data matching your search criteria.'}
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
                        data-cy="tablecell-results"
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? 'asc' : false}
                      >
                        {headCell.id === 'name' ||
                        headCell.id === 'service_id' ||
                        headCell.id === 'type' ? (
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? 'asc' : 'desc'}
                            onClick={() => createSortHandler(headCell.id)}
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            {headCell.label}
                          </TableSortLabel>
                        ) : (
                          <Typography align="left">{headCell.label}</Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services?.map((service) => {
                    return (
                      <TableRow
                        data-cy="table-row-results"
                        hover
                        key={service.id}
                      >
                        <TableCell>
                          <Typography variant="h5">{service.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {service.organisation_id}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {service.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {service.type}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell align="left">
                          <Typography noWrap>
                            <Tooltip
                              data-cy="edit-button"
                              title={t('Edit')}
                              arrow
                            >
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenEditService(service)}
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              data-cy="delete-button"
                              title={t('Delete')}
                              arrow
                            >
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenDelete(service)}
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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
                data-cy="table-pagination"
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

      <DialogWrapper
        open={openEdit}
        fullWidth
        maxWidth="md"
        onClose={handleCloseEditService}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography data-cy="edit-form-title" variant="h4" gutterBottom>
            {t('Edit service fields')}
          </Typography>
          <Typography data-cy="edit-form-subtitle" variant="subtitle2">
            {t('Fill in the fields below to edit the service')}
          </Typography>
        </DialogTitle>
        <AddServiceForm
          addService={handleFormSubmit}
          handleCancel={handleCloseEditService}
          initialData={serviceData}
        />
      </DialogWrapper>

      <DialogWrapper
        open={openDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDelete}
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
            dta-cy="delete-assurance-text"
          >
            {t('Are you sure you want to permanently delete this service?')}
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
              data-cy="delete-button-final"
            >
              {t('Delete')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

export default Results;
