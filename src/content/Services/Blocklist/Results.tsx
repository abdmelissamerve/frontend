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
import { useRouter } from 'next/router';
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
  TableSortLabel,
  Dialog,
  styled,
  DialogTitle,
  Zoom,
  Tab
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useSnackbar } from 'notistack';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { updateBlocklist, deleteBlocklist } from 'src/services/blocklist';
import CircleIcon from '@mui/icons-material/Circle';
import Paper from '@mui/material/Paper';
import dynamic from 'next/dynamic';
import { LockOpen } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';

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

const AddBlocklistForm = dynamic(
  () => import('../BlocklistOrganisation/AddBlocklistForm'),
  {
    ssr: false
  }
);

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

interface ResultsProps {
  blocklists: any;
  page: any;
  limit: any;
  getBlocklists: Function;
  handlePageChange: Function;
  handleLimitChange(event: ChangeEvent<HTMLInputElement>);
  handleQueryChange: Function;
  orderBy: any;
  createSortHandler: Function;
  handleTabsChange: Function;
  filters: any;
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
  blocklists,
  handleQueryChange,
  page,
  limit,
  handleLimitChange,
  handlePageChange,
  getBlocklists,
  orderBy,
  createSortHandler,
  handleTabsChange,
  filters,
  loading,
  error
}) => {
  const router = useRouter();
  const { t }: { t: any } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [blocklistId, setBlocklistId] = useState('');
  const [blocklistAction, setBlocklistAction] = useState(false);
  const [openConfirmDisable, setOpenConfirmDisable] = useState(false);
  const [blocklistData, setBlocklistData] = useState({
    id: '',
    domain: '',
    ipv4: '',
    ipv6: '',
    dom: '',
    description: '',
    delist_url: '',
    response: '',
    responseArray: [
      {
        code: '',
        description: ''
      }
    ]
  });

  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const handleOpenDelete = (blocklist) => {
    setBlocklistId(blocklist.id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteCompleted = async () => {
    await deleteBlocklist(router.query.organisationId, blocklistId);
    await getBlocklists({
      search: '',
      order_by: orderBy,
      skip: page * limit,
      limit: limit
    });
    setOpenDelete(false);
    enqueueSnackbar(t('The blocklist has been removed'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom,
      autoHideDuration: 2000
    });
  };

  const handleOpenEditBlocklist = (blocklist) => {
    setBlocklistData({
      id: blocklist.id,
      domain: blocklist.domain,
      ipv4: blocklist.ipv4,
      ipv6: blocklist.ipv6,
      dom: blocklist.dom,
      description: blocklist.description,
      delist_url: blocklist.delist_url,
      response: blocklist.response,
      responseArray: blocklist.response.responses
    });
    setOpenEdit(true);
  };

  const handleCloseEditBlocklist = () => {
    setOpenEdit(false);
  };

  interface Data {
    id: string;
    domain: string;
    delist_url: string;
    ipv4: string;
    ipv6: string;
    dom: string;
    asn: string;
    response: string;
    description: string;
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
      id: 'domain',
      label: 'Domain'
    },
    {
      id: 'delist_url',
      label: 'Delist Url'
    },
    {
      id: 'ipv4',
      label: 'IPV4'
    },
    {
      id: 'ipv6',
      label: 'IPV6'
    },
    {
      id: 'dom',
      label: 'DOM'
    },
    {
      id: 'asn',
      label: 'ASN'
    },
    {
      id: 'response',
      label: 'Response'
    },
    {
      id: 'description',
      label: 'Description'
    },
    {
      id: 'actions',
      label: 'Actions'
    }
  ];

  const handleEditSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      if(_values.responseArray.length === 0) {
        setStatus({ success: false });
        setErrors({ submit: 'You must have at least one response code' });
        setSubmitting(false);
        return
      }
      const uniqueValues = new Set(_values.responseArray.map(v => v.code));
      if(uniqueValues.size !== _values.responseArray.length){
        setStatus({ success: false });
        setErrors({ submit: 'Cannot have duplicates in response list' });
        setSubmitting(false);
        return
      }
      const data = {
        domain: _values.domain,
        description: _values.description,
        response: {
          responses: _values.responseArray
        },
        delist_url: _values.delist_url,
        ipv4: _values.ipv4,
        ipv6: _values.ipv6,
        dom: _values.dom
      };
      await updateBlocklist(
        data,
        router.query.organisationId,
        blocklistData.id
      );
      await getBlocklists({
        search: '',
        order_by: orderBy,
        skip: page * limit,
        limit: limit
      });
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(
      () => handleQueryChange(event.target.value),
      500
    );
  };

  const handleOpenDisable = (blocklist, action) => {
    setBlocklistId(blocklist.id);
    setBlocklistAction(action);
    setOpenConfirmDisable(true);
  };

  const handleCloseDisable = () => {
    setOpenConfirmDisable(false);
  };

  const confirmAction = async () => {
    await updateBlocklist(
      { disabled: blocklistAction },
      router.query.organisationId,
      blocklistId
    );
    setOpenConfirmDisable(false);
    await getBlocklists({
      search: '',
      order_by: orderBy,
      skip: page * limit,
      limit: limit
    });
  };

  const tabs = [
    {
      value: 'all',
      label: t(`ALL`)
    },
    {
      value: 'ipv4',
      label: t(`IPV4`)
    },
    {
      value: 'ipv6',
      label: t(`IPV6`)
    },
    {
      value: 'dom',
      label: t(`DOM`)
    },
    {
      value: 'asn',
      label: t(`ASN`)
    },
    {
      value: 'is_disabled',
      label: t(`DISABLED`)
    }
  ];

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
          value={
            filters.type || (filters.is_disabled && 'is_disabled') || 'all'
          }
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </TabsWrapper>
      </Box>
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
            placeholder={t('Search by country, city or data center...')}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>
        <Divider />
        {!blocklists || !blocklists.length ? (
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
                        {headCell.id !== 'actions' &&
                        headCell.id !== 'ipv4' &&
                        headCell.id !== 'ipv6' &&
                        headCell.id !== 'dom' &&
                        headCell.id !== 'response' ? (
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? 'asc' : 'desc'}
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
                  {blocklists.map((blocklist) => {
                    return [
                      <TableRow
                        style={{
                          background:
                            blocklist.disabled == true ? '#FED8D8' : ''
                        }}
                        hover
                        key={blocklist.id}
                      >
                        <TableCell>
                          <Typography variant="h5">{blocklist.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap variant="subtitle2">
                              {blocklist.domain}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap variant="subtitle2">
                              {blocklist.delist_url}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {blocklist.ipv4 == true ? (
                            <CircleIcon
                              style={{ color: '#1CD63F' }}
                              sx={{ fontSize: '20px' }}
                            />
                          ) : (
                            <CircleIcon
                              style={{ color: 'red' }}
                              sx={{ fontSize: '20px' }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {blocklist.ipv6 == true ? (
                            <CircleIcon
                              style={{ color: '#1CD63F' }}
                              sx={{ fontSize: '20px' }}
                            />
                          ) : (
                            <CircleIcon
                              style={{ color: 'red' }}
                              sx={{ fontSize: '20px' }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {blocklist.dom == true ? (
                            <CircleIcon
                              style={{ color: '#1CD63F' }}
                              sx={{ fontSize: '20px' }}
                            />
                          ) : (
                            <CircleIcon
                              style={{ color: 'red' }}
                              sx={{ fontSize: '20px' }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {blocklist.asn == true ? (
                            <CircleIcon
                              style={{ color: '#1CD63F' }}
                              sx={{ fontSize: '20px' }}
                            />
                          ) : (
                            <CircleIcon
                              style={{ color: 'red' }}
                              sx={{ fontSize: '20px' }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{ ml: -1, mr: 2 }}
                          >
                            <Table size="small" aria-label="a dense table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Code</TableCell>
                                  <TableCell>Description</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {blocklist.response.responses.map((item) => {
                                  return [
                                    <TableRow>
                                      <TableCell>{item.code}</TableCell>
                                      <TableCell>{item.description}</TableCell>
                                    </TableRow>
                                  ];
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5">
                            {blocklist.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleOpenEditBlocklist(blocklist)
                                }
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenDelete(blocklist)}
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {blocklist.disabled == true ? (
                              <Tooltip title={t('Enable')} arrow>
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleOpenDisable(blocklist, false)
                                  }
                                >
                                  <LockOpen fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title={t('Disable')} arrow>
                                <IconButton
                                  onClick={() =>
                                    handleOpenDisable(blocklist, true)
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
        open={openEdit}
        fullWidth
        maxWidth="md"
        onClose={handleCloseEditBlocklist}
      >
        <DialogTitle
          sx={{
            p: 1
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Add blocklist')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to add a blocklist')}
          </Typography>
        </DialogTitle>
        <AddBlocklistForm
          addBlocklist={handleEditSubmit}
          handleCancel={handleCloseEditBlocklist}
          initialData={blocklistData}
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
          >
            {t('Are you sure you want to permanently delete this blocklist')}?
          </Typography>

          <Box>
            <Button
              variant="text"
              size="small"
              sx={{
                mx: 1
              }}
              onClick={handleCloseDelete}
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
            {t('Are you sure you want to disable this blocklist?')}
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
            {blocklistAction == true ? (
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
    </>
  );
};

export default Results;
