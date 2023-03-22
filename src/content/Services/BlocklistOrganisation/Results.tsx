import React, {
  FC,
  ChangeEvent,
  useRef,
  useState,
  ReactElement,
  Ref,
  forwardRef
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
  updateBlocklistOrganisation,
  deleteBlocklistOrganistion,
  addBlockList
} from 'src/services/blocklist';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';

const AddBlocklistOrgForm = dynamic(() => import('./AddBlocklistOrgForm'), {
  ssr: false
});
import { useSnackbar } from 'notistack';

const AddBlocklistForm = dynamic(() => import('./AddBlocklistForm'), {
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
  blocklists: any;
  page: any;
  limit: any;
  getBlocklists: Function;
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
  blocklists,
  handleQueryChange,
  page,
  limit,
  handleLimitChange,
  handlePageChange,
  getBlocklists,
  createSortHandler,
  orderBy,
  loading,
  error
}) => {
  const { t }: { t: any } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddBlocklist, setOpenAddBlocklist] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [blocklistData, setBlocklistData] = useState({
    id: '',
    name: '',
    domain: ''
  });

  const handleOpenAddblocklist = (blocklist) => {
    setBlocklistData({
      id: blocklist.id,
      name: blocklist.name,
      domain: blocklist.domain
    });
    setOpenAddBlocklist(true);
  };

  const handleCloseAddBlocklist = () => {
    setOpenAddBlocklist(false);
  };

  const handleOpenDelete = (blocklist) => {
    setBlocklistData({
      id: blocklist.id,
      name: blocklist.name,
      domain: blocklist.domain
    });
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteCompleted = async () => {
    await deleteBlocklistOrganistion(blocklistData.id);
    await getBlocklists({
      search: '',
      order_by: orderBy,
      skip: page * limit,
      limit: limit
    });
    setOpenDelete(false);
    enqueueSnackbar(t('The blocklist organisation has been removed'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const handleOpenEditBlocklist = (blocklist) => {
    setBlocklistData({
      id: blocklist.id,
      name: blocklist.name,
      domain: blocklist.domain
    });
    setOpenEdit(true);
  };

  const handleCloseEditBlocklist = () => {
    setOpenEdit(false);
  };
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  interface Data {
    name: string;
    domain: string;
    actions: string;
  }

  interface HeadCell {
    id: keyof Data;
    label: string;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: 'name',
      label: 'Name'
    },
    {
      id: 'domain',
      label: 'Domain'
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

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const data = {
        name: _values.name,
        domain: _values.domain
      };
      await updateBlocklistOrganisation(data, blocklistData.id);
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
      setErrors({ submit: err.data.detail });
      setSubmitting(false);
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

  const handleAddBlocklist = async (
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
          responses: responseList
        },
        ipv4: _values.ipv4,
        ipv6: _values.ipv6,
        dom: _values.dom,
        asn: _values.asn
      };
      await addBlockList(data, blocklistData.id);
      resetForm();
      setResponseList([]);
      setStatus({ success: true });
      setSubmitting(false);
      setOpenAddBlocklist(false);
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
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
            placeholder={t('Search by country, city or data center...')}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>
        <Divider />
        {blocklists?.length === 0 ? (
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
                        {headCell.id !== 'actions' ? (
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? 'asc' : 'desc'}
                            onClick={() => createSortHandler(headCell.id)}
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            {headCell.label}
                          </TableSortLabel>
                        ) : (
                          <Typography align="center">
                            {headCell.label}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blocklists?.map((blocklist) => {
                    return (
                      <TableRow hover key={blocklist.id}>
                        <TableCell>
                          <Typography variant="h5">{blocklist.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography
                              noWrap
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                window.open(blocklist.domain, '_blank')
                              }
                            >
                              {blocklist.domain}
                            </Typography>
                          </Box>
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
                            <Tooltip title={t('Add blocklist')} arrow>
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleOpenAddblocklist(blocklist)
                                }
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('See blocklist')} arrow>
                              <IconButton color="primary">
                                <NextLink
                                  href={{
                                    pathname: `/blocklist_organisations/blocklists/${blocklist.id}`,
                                    query: {
                                      name: blocklist.name
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
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Edit blocklist organisation fields')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to edit the blocklist organisation')}
          </Typography>
        </DialogTitle>
        <AddBlocklistOrgForm
          addBlocklistOrg={handleFormSubmit}
          handleCancel={handleCloseEditBlocklist}
          initialData={blocklistData}
        />
      </DialogWrapper>

      <DialogWrapper
        open={openAddBlocklist}
        fullWidth
        maxWidth="md"
        onClose={handleCloseAddBlocklist}
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
          addBlocklist={handleAddBlocklist}
          handleCancel={handleCloseAddBlocklist}
          setResponseValues={setResponseValues}
          removeResponse={removeResponse}
          responseList={responseList}
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
            {t(
              'Are you sure you want to permanently delete this blocklist organisation'
            )}
            ?
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
    </>
  );
};

export default Results;
