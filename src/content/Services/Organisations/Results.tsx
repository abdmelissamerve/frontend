import React, {
  FC,
  ChangeEvent,
  useRef,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useEffect
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
import {
  updateOrganisation,
  deleteOrganisation,
  addOrganisation
} from 'src/services/organisations';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { apiInstance } from '@/api-config/api';
import NextLink from 'next/link';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

const AddOrganisationForm = dynamic(() => import('./AddOrganisationForm'), {
  ssr: false
});

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
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
  organisations: any;
  page: any;
  limit: any;
  getOrganisations: Function;
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
  organisations,
  handleQueryChange,
  page,
  limit,
  handleLimitChange,
  handlePageChange,
  getOrganisations,
  createSortHandler,
  orderBy,
  loading,
  error
}) => {
  const { t }: { t: any } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [organisationData, setOrganisationData] = useState({
    id: '',
    name: '',
    website: '',
    logo_url: ''
  });

  const handleOpenDelete = (organisation) => {
    setOrganisationData({
      id: organisation.id,
      name: organisation.name,
      website: organisation.website,
      logo_url: organisation.logo_url
    });
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteCompleted = async () => {
    await deleteOrganisation(organisationData.id);
    await getOrganisations({
      search: '',
      order_by: orderBy,
      skip: page * limit,
      limit: limit
    });
    setOpenDelete(false);
    enqueueSnackbar(t('The organisation has been removed'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const handleOpenEditOrganisation = (organisation) => {
    setOrganisationData({
      id: organisation.id,
      name: organisation.name,
      website: organisation.website,
      logo_url: organisation.logo_url
    });
    setOpenEdit(true);
  };

  const handleCloseEditOrganisation = () => {
    setOpenEdit(false);
  };
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  interface Data {
    name: string;
    id: number;
    uuid: string;
    created_at: string;
    actions: string;
    website: string;
    logo: string;
  }

  interface HeadCell {
    id: keyof Data;
    label: string;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: 'id',
      label: 'Id'
    },
    {
      id: 'uuid',
      label: 'Uuid'
    },
    {
      id: 'name',
      label: 'Name'
    },
    {
      id: 'website',
      label: 'Website'
    },
    {
      id: 'actions',
      label: 'Actions'
    }
  ];
  useEffect(() => {}, [organisationData]);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(
      () => handleQueryChange(event.target.value),
      500
    );
  };

  const handleEditOrganisationsSuccess = () => {
    enqueueSnackbar(t('The organisations has been edited successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom,
      autoHideDuration: 2000
    });

    setOpenEdit(false);
  };

  const handleFormSubmit = async (_values) => {
    try {
      const data = {
        name: _values.name,
        website: _values.website,
        logo_url: _values.logo_url
      };
      await updateOrganisation(data, organisationData.id);
      handleEditOrganisationsSuccess();
      await getOrganisations({
        search: '',
        order_by: orderBy,
        skip: page * limit,
        limit: limit
      });
    } catch (err) {
      console.error(err);
    }
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
            placeholder={t('Search by uuid, name or website')}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
            data-cy="search-bar"
          />
        </Box>
        <Divider />
        {organisations?.length === 0 ? (
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
                        headCell.id === 'id' ||
                        headCell.id === 'website' ? (
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
                  {organisations?.map((organisation) => {
                    return (
                      <TableRow
                        data-cy="table-row-results"
                        hover
                        key={organisation.id}
                      >
                        <TableCell>
                          <Typography variant="h5">
                            {organisation.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {organisation.uuid}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {organisation.name}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography
                              noWrap
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                window.open(organisation.website, '_blank')
                              }
                            >
                              {organisation.website}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography
                              noWrap
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                window.open(organisation.logo, '_blank')
                              }
                            >
                              {organisation.logo}
                            </Typography>
                          </Box>
                        </TableCell> */}

                        <TableCell align="left">
                          <Typography noWrap>
                            <Tooltip
                              data-cy="edit-button"
                              title={t('Edit')}
                              arrow
                            >
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleOpenEditOrganisation(organisation)
                                }
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
                                onClick={() => handleOpenDelete(organisation)}
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={t('See member')} arrow>
                              <IconButton color="primary">
                                <NextLink
                                  href={{
                                    pathname: `/organisations/members/${organisation.id}`,
                                    query: {
                                      name: organisation.name
                                    }
                                  }}
                                >
                                  <FormatListNumberedIcon fontSize="small" />
                                </NextLink>
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
        onClose={handleCloseEditOrganisation}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography data-cy="edit-form-title" variant="h4" gutterBottom>
            {t('Edit organisation fields')}
          </Typography>
          <Typography data-cy="edit-form-subtitle" variant="subtitle2">
            {t('Fill in the fields below to edit the organisation')}
          </Typography>
        </DialogTitle>
        <AddOrganisationForm
          addOrganisation={handleFormSubmit}
          handleCancel={handleCloseEditOrganisation}
          initialData={organisationData}
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
            {t(
              'Are you sure you want to permanently delete this organisation?'
            )}
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
