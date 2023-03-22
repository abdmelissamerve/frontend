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
import {
  updateMembership,
  removeMember,
  getOrganisationMembers
} from 'src/services/organisations';
import { useSnackbar } from 'notistack';
import { useRefMounted } from 'src/hooks/useRefMounted';
import dynamic from 'next/dynamic';
import { useFetchData } from '@/hooks/useFetch';

const AddMemberForm = dynamic(() => import('./AddMemberForm'), {
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
    getOrganisationMembers
  );
  const { t }: { t: any } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);
  const isMountedRef = useRefMounted();
  const [members, setMembers] = useState<any>();
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [orderBy, setOrderBy] = useState('-created_at');
  const [organisationsMembers, setOrganisationsMembers] = useState<any>();

  const getMembers = useCallback(
    async (id: any, data: any) => {
      try {
        const response = await getOrganisationMembers(id, data);
        if (isMountedRef()) {
          setMembers(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMountedRef]
  );
  const { enqueueSnackbar } = useSnackbar();
  const [memberData, setMemberData] = useState({
    id: '',
    email: '',
    role: ''
  });

  const handleOpenAddMember = (member) => {
    setMemberData({
      id: member.id,
      email: member.email,
      role: member.role
    });

    setOpenAddMember(true);
  };

  const handleCloseEditMember = () => {
    setOpenEdit(false);
  };

  const handleCloseAddMember = () => {
    setOpenAddMember(false);
  };

  const handleOpenDelete = (member) => {
    setMemberData({
      id: member.id,
      email: member.email,
      role: member.role
    });
    setOpenDelete(true);
  };

  const handleOpenEditMember = (member) => {
    setMemberData({
      id: member.id,
      email: member.email,
      role: member.role
    });
    setOpenEdit(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteCompleted = async () => {
    await removeMember(organisationId, memberData.id);
    location.reload();
    setOpenDelete(false);
    enqueueSnackbar(t('The member has been removed'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
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

  useEffect(() => {
    if (!data?.length) {
      setPage((prevPage) => Math.max(0, prevPage - 1));
    }
  }, [data]);

  interface Data {
    first_name: string;
    last_name: string;
    user_id: number;
    organisation_id: number;
    role: string;
    email: string;
    photo_url: string;
    actions: string;
  }

  interface HeadCell {
    id: keyof Data;
    label: string;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: 'user_id',
      label: 'User Id'
    },
    {
      id: 'organisation_id',
      label: 'Organisation Id'
    },
    {
      id: 'first_name',
      label: 'First name'
    },
    {
      id: 'last_name',
      label: 'Last name'
    },
    {
      id: 'role',
      label: 'Role'
    },
    {
      id: 'email',
      label: 'Email'
    },
    {
      id: 'photo_url',
      label: 'Photo URL'
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
    setOrganisationsMembers(getMembers(organisationId, data));
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
        organisation_id: organisationId,
        role: _values.role,
        user_id: memberData.id
      };
      await updateMembership(data);
      await getOrganisationMembers(organisationId, {
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
      <Typography data-cy="my-organisation-title" variant="h4" gutterBottom>
        {t('Organisation Members')}
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
            placeholder={t(
              'Search by user id, first name, last name, role or email'
            )}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
            data-cy="members-search-bar"
          />
        </Box>
        <Divider />
        {organisationsMembers?.length === 0 ? (
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
                        {headCell.id === 'first_name' ||
                        headCell.id === 'user_id' ||
                        headCell.id === 'last_name' ||
                        headCell.id === 'role' ? (
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
                  {members?.map((member) => {
                    return (
                      <TableRow
                        data-cy="table-row-results"
                        hover
                        key={member.id}
                      >
                        <TableCell>
                          <Typography variant="h5">{member.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {member.organisation_id}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {member.first_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {member.last_name}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {member.role}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography
                              noWrap
                              style={{ cursor: 'pointer' }}
                              onClick={() => window.open(member.logo, '_blank')}
                            >
                              {member.email}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {member.photo_url}
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
                                onClick={() => handleOpenEditMember(member)}
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              data-cy="member-delete-button"
                              title={t('Remove')}
                              arrow
                            >
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenDelete(member)}
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
        onClose={handleCloseEditMember}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography data-cy="edit-form-title" variant="h4" gutterBottom>
            {t('Edit member fields')}
          </Typography>
          <Typography data-cy="edit-form-subtitle" variant="subtitle2">
            {t('Fill in the fields below to edit the member')}
          </Typography>
        </DialogTitle>
        <AddMemberForm
          addMember={handleFormSubmit}
          handleCancel={handleCloseEditMember}
          initialData={memberData}
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
              'Are you sure you want to remove this member from your organisation?'
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
              {t('Remove')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

export default Results;
