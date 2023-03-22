import {
  FC,
  ChangeEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useRef
} from 'react';

import PropTypes from 'prop-types';
import {
  Box,
  Card,
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
  TextField,
  Button,
  Typography,
  Dialog,
  Zoom,
  styled,
  TableSortLabel,
  Link
} from '@mui/material';

import { TransitionProps } from '@mui/material/transitions';

import type { Provider } from 'src/types/providers';
import { useTranslation } from 'react-i18next';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useSnackbar } from 'notistack';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';

import { apiInstance } from '@/api-config/api';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
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
  loading
}) => {
  const [selectedItems, setSelectedProviders] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const selectedBulkActions = selectedItems.length > 0;

  const [providerValues, setProviderValues] = useState({});
  const [providerStatistics, setProviderStatistics] = useState([]);
  const [providerChanges, setProviderChanges] = useState({});
  const [providerId, setProviderId] = useState(null);

  const handleOpenChanges = (provider) => {
    setProviderValues({
      site: provider.site,
      login_link: provider.loginLink,
      description: provider.description,
      services: provider.services,
      logo: provider.logo
    });
    setProviderStatistics(provider.statistics);
    setProviderChanges(provider.changes);
    setProviderId(provider.id);
    setOpen(true);
  };
  const handleCloseChanges = () => {
    setOpen(false);
  };

  interface Data {
    id: number;
    name: string;
    changes: any;
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
      id: 'changes',
      label: 'Changed Field'
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

  const requestAnswer = async (answer: boolean) => {
    try {
      await apiInstance.requestAnswer(answer, providerId);
      await getProvidersList({
        search: '',
        sortBy: orderBy,
        skip: page * limit,
        limit: limit
      });
      setOpen(false);
      if (answer == true) {
        enqueueSnackbar(t('The data has been saved successfully'), {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      } else {
        enqueueSnackbar(t('Providerdata has been removed.'), {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      }
    } catch (error) {
      setOpen(false);
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

  return (
    <>
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
              placeholder={t('Search by provider name...')}
              size="small"
              fullWidth
              margin="normal"
              variant="outlined"
            />
          )}
          {selectedBulkActions && <BulkActions />}
        </Box>

        <Divider />
        {providers?.filter((provider) => provider.changes != null).length ==
        0 ? (
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
              {loading ? 'Loading...' : 'No changes to display.'}
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
                  {providers
                    ?.filter((provider) => provider.changes != null)
                    .map((provider) => {
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
                            {Object.keys(provider.changes).map((keyName, i) => (
                              <li className="travelcompany-input" key={i}>
                                <span className="input-label">{keyName}</span>
                              </li>
                            ))}
                          </TableCell>
                          <TableCell align="left">
                            <Typography noWrap>
                              <Tooltip title={t('View changes')} arrow>
                                <IconButton
                                  onClick={() => handleOpenChanges(provider)}
                                  color="primary"
                                >
                                  <LaunchTwoToneIcon fontSize="small" />
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

      <DialogWrapper
        open={open}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseChanges}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={4}
        >
          <Grid container spacing={3}>
            <Grid item xs>
              <Typography
                align="left"
                sx={{
                  py: 4,
                  px: 1
                }}
                variant="h4"
              >
                {t('CURRENT')}
              </Typography>

              {Object.keys(providerValues).map((keyName, i) => (
                <Grid container spacing={3} padding={1}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign="left"
                  >
                    <Box pr={3} alignSelf="center">
                      <b>{keyName.toLocaleUpperCase()}:</b>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Typography>{providerValues[keyName]}</Typography>
                  </Grid>
                </Grid>
              ))}
              {providerStatistics != [] && (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign="left"
                >
                  <Box p={1} alignSelf="center">
                    <b>STATISTICS:</b>
                  </Box>
                </Grid>
              )}
              {providerStatistics.map((item) => (
                <Grid container spacing={3} padding={1} sx={{ ml: 1 }}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign="left"
                  >
                    <Box pr={3} alignSelf="center">
                      <b>Number:</b>
                    </Box>
                    <Box pr={3} alignSelf="center">
                      <b>Label:</b>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Typography>{item.number}</Typography>
                    <Typography>{item.label}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Divider orientation="vertical" flexItem></Divider>
            <Grid item xs>
              <Typography
                align="left"
                sx={{
                  py: 4,
                  px: 1
                }}
                variant="h4"
              >
                {t('CHANGES')}
              </Typography>
              {Object.keys(providerChanges).map((keyName, i) => {
                return (
                  keyName != 'statistics' && (
                    <Grid container spacing={3} padding={1}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        justifyContent="flex-end"
                        textAlign="left"
                      >
                        <Box pr={3} alignSelf="center">
                          <b>{keyName.toLocaleUpperCase()}:</b>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Typography>{providerChanges[keyName]}</Typography>
                      </Grid>
                    </Grid>
                  )
                );
              })}
              {providerChanges['statistics'] && (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign="left"
                >
                  <Box p={1} alignSelf="center">
                    <b>STATISTICS:</b>
                  </Box>
                </Grid>
              )}
              {Object.keys(providerChanges).map((keyName, i) => {
                return (
                  keyName == 'statistics' &&
                  providerChanges[keyName][keyName].map((item) => (
                    <Grid container spacing={3} padding={1} sx={{ ml: 1 }}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        justifyContent="flex-end"
                        textAlign="left"
                      >
                        <Box pr={3} alignSelf="center">
                          <b>Number:</b>
                        </Box>
                        <Box pr={3} alignSelf="center">
                          <b>Label:</b>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Typography>{item.number}</Typography>
                        <Typography>{item.label}</Typography>
                      </Grid>
                    </Grid>
                  ))
                );
              })}
            </Grid>
          </Grid>
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                mx: 1
              }}
              onClick={() => requestAnswer(true)}
            >
              {t('Accept')}
            </Button>
            <Button
              onClick={() => requestAnswer(false)}
              size="small"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="outlined"
            >
              {t('Decline')}
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                mx: 1
              }}
              onClick={handleCloseChanges}
            >
              {t('Cancel')}
            </Button>
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
