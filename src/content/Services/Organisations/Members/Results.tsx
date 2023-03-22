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
  Zoom,
  Button,
  Slide,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CancelIcon from '@mui/icons-material/Cancel';

import { removeMember, cancelInvitation } from 'src/services/organisations';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { updateMembership } from 'src/services/organisations';
import { filter } from 'cypress/types/bluebird';

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
  members: any;
  page: any;
  limit: any;
  getMembers: Function;
  handlePageChange: Function;
  handleTabsChange: Function;
  handleLimitChange(event: ChangeEvent<HTMLInputElement>);
  handleQueryChange: Function;
  createSortHandler: Function;
  orderBy: any;
  loading: boolean;
  error: any;
  filters: any;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Results: FC<ResultsProps> = ({
  members,
  handleQueryChange,
  page,
  limit,
  handleTabsChange,
  handleLimitChange,
  handlePageChange,
  getMembers,
  createSortHandler,
  orderBy,
  loading,
  error,
  filters
}) => {
  const { t }: { t: any } = useTranslation();
  const [openDelete, setOpenDelete] = useState(false);

  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const { enqueueSnackbar } = useSnackbar();
  const [memberData, setMemberData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const router = useRouter();
  const [editRole, setEditRole] = useState('');

  const handleOpenDelete = (member) => {
    setMemberData(member);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteCompleted = async () => {
    if (memberData.status == 'pending') {
      await cancelInvitation({
        organisation_id: router.query.organisationId,
        id: memberData.id
      });
    } else {
      await removeMember({
        organisation_id: router.query.organisationId,
        user_id: memberData.id
      });
    }
    await getMembers({
      search: '',
      order_by: orderBy,
      skip: page * limit,
      limit: limit,
      type: filters.type
    });
    setOpenDelete(false);
    enqueueSnackbar(t('The member has been removed'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom,
      autoHideDuration: 2000
    });
  };

  const tabs = [
    {
      value: 'members',
      label: t('Members')
    },
    {
      value: 'invitations',
      label: t('Invitations')
    }
  ];

  interface Data {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
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
      id: 'email',
      label: 'Email'
    },
    {
      id: 'role',
      label: 'Role'
    },
    {
      id: 'status',
      label: 'Status'
    },
    {
      id: 'actions',
      label: 'Actions'
    }
  ];

  useEffect(() => {}, [memberData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(
      () => handleQueryChange(event.target.value),
      500
    );
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleChangeRole = (event, member) => {
    setMemberData(member);
    setEditRole(event.target.value);
    setOpenEdit(true);
  };

  const handleEditCompleted = async () => {
    try {
      await updateMembership({
        organisation_id: router.query.organisationId,
        user_id: memberData.id,
        role: editRole
      });
      await getMembers({
        search: '',
        order_by: orderBy,
        skip: page * limit,
        limit: limit,
        type: filters.type
      });
      setOpenEdit(false);
      enqueueSnackbar(t('The member role has been updated successfully.'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom,
        autoHideDuration: 2000
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
          variant="scrollable"
          value={filters.type}
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
            placeholder={t('Search by id, name, email, status...')}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
            data-cy="search-bar"
          />
        </Box>
        <Divider />
        {members?.length === 0 ? (
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
                        {headCell.id === 'id' ||
                        headCell.id === 'name' ||
                        headCell.id === 'email' ||
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
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {member.id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {member.first_name && member.last_name ? (
                              <Typography noWrap style={{ cursor: 'pointer' }}>
                                {member.first_name} {member.last_name}
                              </Typography>
                            ) : (
                              <Typography noWrap style={{ cursor: 'pointer' }}>
                                Invited member
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {member.email}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {member.status != 'pending' ? (
                              <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                              >
                                <Select
                                  value={member.role}
                                  onChange={(event) =>
                                    handleChangeRole(event, member)
                                  }
                                >
                                  <MenuItem value={'member'}>
                                    {t('member')}
                                  </MenuItem>
                                  <MenuItem value={'owner'}>
                                    {t('owner')}
                                  </MenuItem>
                                  <MenuItem value={'admin'}>
                                    {t('admin')}
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            ) : (
                              <Typography noWrap style={{ cursor: 'pointer' }}>
                                {member.role}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography noWrap style={{ cursor: 'pointer' }}>
                              {member.status == 'pending'
                                ? member.status
                                : 'active'}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell align="left">
                          <Typography noWrap>
                            <Tooltip
                              data-cy="delete-button"
                              title={t('Delete')}
                              arrow
                            >
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenDelete(member)}
                              >
                                {member.status == 'pending' ? (
                                  <CancelIcon fontSize="small" />
                                ) : (
                                  <DeleteTwoToneIcon fontSize="small" />
                                )}
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
            {memberData?.status == 'pending'
              ? t('Are you sure you want to cancel this invitation?')
              : t(
                  'Are you sure you want to permanently remove this member from the eorganisation?'
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
              {memberData?.status == 'pending'
                ? t('Cancel invitation')
                : t('Remove')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>

      <DialogWrapper
        open={openEdit}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseEdit}
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
            {t(`Are you sure you want to change the role to ${editRole}?`)}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="small"
              sx={{
                mx: 1
              }}
              onClick={handleCloseEdit}
              data-cy="cancel-button-delete-final"
            >
              {t('Cancel')}
            </Button>
            <ButtonError
              onClick={handleEditCompleted}
              size="small"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="outlined"
              color="error"
              data-cy="delete-button-final"
            >
              {t('Save')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

export default Results;
