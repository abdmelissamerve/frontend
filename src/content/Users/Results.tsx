import { FC, ChangeEvent, useState, ReactElement, Ref, forwardRef, useRef } from "react";

import PropTypes from "prop-types";
import CircleIcon from "@mui/icons-material/Circle";
import LockResetIcon from "@mui/icons-material/LockReset";
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
    Tab,
    TableSortLabel,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useTranslation } from "react-i18next";
import BulkActions from "./BulkActions";
import CloseIcon from "@mui/icons-material/Close";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useSnackbar } from "notistack";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { updateUser, deleteUser, resetPassword } from "@/services/users";

import dynamic from "next/dynamic";

const EdituserForm = dynamic(() => import("./EditUserForm"), {
    ssr: false,
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

const ButtonSuccess = styled(Button)(
    ({ theme }) => `
     background: ${theme.colors.primary.dark};
     color: ${theme.palette.success.contrastText};

     &:hover {
        background: ${theme.colors.primary.light};
     }
    `
);

interface ResultsProps {
    users: any;
    getUsersList: Function;
    handleTabsChange: Function;
    filters: any;
    page: any;
    limit: any;
    handlePageChange: Function;
    handleLimitChange(event: ChangeEvent<HTMLInputElement>);
    query: any;
    handleQueryChange: Function;
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
    users,
    getUsersList,
    filters,
    handleTabsChange,
    page,
    limit,
    handleLimitChange,
    handlePageChange,
    handleQueryChange,
    query,
    loading,
    error,
}) => {
    const [selectedItems, setSelectedusers] = useState<string[]>([]);
    const { t }: { t: any } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const selectedBulkActions = selectedItems.length > 0;

    const [toggleView, setToggleView] = useState<string | null>("table_view");
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [userData, setUserData] = useState(null);
    const [openConfirmResetPassword, setOpenConfirmResetPassword] = useState(false);
    const [userId, setUserId] = useState({});
    const [editUser, setEditUser] = useState(false);
    const timeout = useRef<ReturnType<typeof setTimeout>>();

    const handleOpenEditUser = (user) => {
        setUserData({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            is_active: {
                label: user.is_active ? "Active" : "Inactive",
                value: user.is_active ? true : false,
            },
            role: {
                label: user.role === "admin" ? "Admin" : user.role === "technician" ? "Technician" : "User",
                value: user.role === "admin" ? "admin" : user.role === "technician" ? "technician" : "user",
            },
        });
        setEditUser(true);
    };
    const handleCloseEditUser = () => {
        setEditUser(false);
    };

    const handleConfirmDelete = (user) => {
        setUserData(user);
        setOpenConfirmDelete(true);
    };

    const closeConfirmDelete = () => {
        setOpenConfirmDelete(false);
    };

    const handleDeleteCompleted = async () => {
        await deleteUser(userData.id);
        await getUsersList({
            search: "",
            role: filters.role,
            is_active: filters.active,
            skip: 0,
            limit: limit,
        });
        setOpenConfirmDelete(false);
        enqueueSnackbar(t("The user has been removed"), {
            variant: "success",
            anchorOrigin: {
                vertical: "top",
                horizontal: "right",
            },
            TransitionComponent: Zoom,
            autoHideDuration: 1000,
        });
    };

    const handleEditFormSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
            let data: any = {
                id: _values.id,
                first_name: _values.first_name,
                last_name: _values.last_name,
                is_active: _values.is_active.value,
                role: _values.role.value,
            };
            if (_values.password !== "") {
                data = { ...data, password: _values.password };
            }
            await updateUser(data, userData.id);
            await getUsersList({
                search: "",
                role: filters.role,
                is_active: filters.active,
                skip: 0,
                limit: limit,
            });
            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            handleCreateUserSuccess();
            setEditUser(false);
        } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };

    const handleCreateUserSuccess = () => {
        enqueueSnackbar(t("The user was edited successfully"), {
            variant: "success",
            anchorOrigin: {
                vertical: "top",
                horizontal: "right",
            },
            TransitionComponent: Zoom,
            autoHideDuration: 1000,
        });
    };

    const tabs = [
        {
            value: "all",
            label: t("All users"),
        },
        {
            value: "admin",
            label: t("Admin"),
        },
        {
            value: "user",
            label: t("User"),
        },
    ];

    interface Data {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        is_active: boolean;
        role: string;
        register_provider: string;
    }

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    type Order = "asc" | "desc";

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key
    ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
        return order === "desc"
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    interface HeadCell {
        id: keyof Data;
        label: string;
        align: string;
    }

    const headCells: readonly HeadCell[] = [
        {
            id: "id",
            label: "ID",
            align: "center",
        },
        {
            id: "first_name",
            label: "Name",
            align: "left",
        },
        {
            id: "email",
            label: "Email",
            align: "left",
        },
        {
            id: "is_active",
            label: "Active",
            align: "center",
        },
        {
            id: "role",
            label: "Role",
            align: "left",
        },
        {
            id: "register_provider",
            label: "Register provider",
            align: "left",
        },
        {
            id: "actions",
            label: "Actions",
            align: "center",
        },
    ];

    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<keyof Data>("id");

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        handleRequestSort(event, property);
    };

    const handleResetPassword = (user) => {
        setUserId(user);
        setOpenConfirmResetPassword(true);
    };

    const sendPasswordResetEmail = () => {
        resetPassword(userId.email).then(() => {
            enqueueSnackbar(t("Password reset email sent!"), {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
                TransitionComponent: Zoom,
            });
            setOpenConfirmResetPassword(false);
        });
    };

    const closeConfirmPasswordReset = () => {
        setOpenConfirmResetPassword(false);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        timeout.current = setTimeout(() => handleQueryChange(event.target.value), 500);
    };

    if (error) {
        return (
            <Typography
                sx={{
                    py: 10,
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
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent={{ xs: "center", sm: "space-between" }}
                pb={3}
            >
                <TabsWrapper
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    textColor="secondary"
                    variant="scrollable"
                    value={filters.role ? filters.role : "" || filters.active ? "active" : "" || "all"}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.value} value={tab.value} label={tab.label} />
                    ))}
                </TabsWrapper>
            </Box>

            {toggleView === "table_view" && (
                <Card>
                    <Box p={2}>
                        {!selectedBulkActions && (
                            <TextField
                                sx={{
                                    m: 0,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchTwoToneIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={handleSearch}
                                placeholder={t("Search by country, city or data center...")}
                                size="small"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        )}
                        {selectedBulkActions && <BulkActions />}
                    </Box>

                    <Divider />

                    {!users?.length ? (
                        <>
                            <Typography
                                sx={{
                                    py: 10,
                                }}
                                variant="h3"
                                fontWeight="normal"
                                color="text.secondary"
                                align="center"
                            >
                                {loading ? "Loading..." : "There is no data mathing your search criteria."}
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
                                                    align={headCell.align}
                                                    key={headCell.id}
                                                    sortDirection={orderBy === headCell.id ? order : false}
                                                >
                                                    {headCell.id == "first_name" ||
                                                    headCell.id == "last_name" ||
                                                    headCell.id == "email" ||
                                                    headCell.id == "register_provider" ||
                                                    headCell.id == "is_active" ||
                                                    headCell.id == "role" ||
                                                    headCell.id == "id" ? (
                                                        <span style={{ position: "relative" }}>
                                                            <span style={{ position: "relative" }}>
                                                                {headCell.label}
                                                            </span>
                                                            <TableSortLabel
                                                                active={orderBy === headCell.id}
                                                                direction={orderBy === headCell.id ? order : "asc"}
                                                                onClick={createSortHandler(headCell.id)}
                                                                sx={{
                                                                    whiteSpace: "nowrap",
                                                                    position: "absolute",
                                                                    bottom: 0,
                                                                }}
                                                            />
                                                        </span>
                                                    ) : (
                                                        <Typography>{headCell.label}</Typography>
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users?.sort(getComparator(order, orderBy)).map((user) => {
                                            return (
                                                <TableRow key={user.id}>
                                                    <TableCell align={"center"}>
                                                        <Typography>{user.id}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{`${user.firstName} ${user.lastName}`}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{user.email}</Typography>
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        <span>
                                                            {user.is_active ? (
                                                                <CircleIcon style={{ color: "#1CD63F" }} />
                                                            ) : (
                                                                <CircleIcon style={{ color: "red" }} />
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{user.register_provider}</Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography noWrap>
                                                            <Tooltip title={t("Edit")} arrow>
                                                                <IconButton
                                                                    onClick={() => handleOpenEditUser(user)}
                                                                    color="primary"
                                                                    size="small"
                                                                    color="primary"
                                                                >
                                                                    <LaunchTwoToneIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={t("Reset Password")} arrow>
                                                                <IconButton
                                                                    onClick={() => handleResetPassword(user)}
                                                                    color="primary"
                                                                >
                                                                    <LockResetIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={t("Delete")} arrow>
                                                                <IconButton
                                                                    onClick={() => handleConfirmDelete(user)}
                                                                    color="primary"
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
            )}
            <DialogWrapper
                open={openConfirmDelete}
                maxWidth="sm"
                fullWidth
                TransitionComponent={Transition}
                keepMounted
                onClose={closeConfirmDelete}
            >
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={5}>
                    <Avatar>
                        <CloseIcon />
                    </Avatar>
                    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={5}>
                        <Typography
                            align="center"
                            sx={{
                                py: 4,
                                px: 6,
                            }}
                            variant="h4"
                        >
                            {t("Are you sure you want to permanently delete this user account")}?
                        </Typography>

                        <Box>
                            <Button
                                variant="text"
                                size="small"
                                sx={{
                                    mx: 1,
                                }}
                                onClick={closeConfirmDelete}
                            >
                                {t("Cancel")}
                            </Button>
                            <Button
                                onClick={handleDeleteCompleted}
                                size="small"
                                sx={{
                                    mx: 1,
                                    px: 3,
                                }}
                                variant="outlined"
                                color="error"
                            >
                                {t("Delete")}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </DialogWrapper>

            {/* Edit user dialog */}
            <Dialog fullWidth maxWidth="md" open={editUser} onClose={handleCloseEditUser}>
                <DialogTitle
                    sx={{
                        p: 3,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {t("Edit user")}
                    </Typography>
                    <Typography variant="subtitle2">
                        {t("Change the desired fields to update the user information.")}
                    </Typography>
                </DialogTitle>
                <EdituserForm
                    editUser={handleEditFormSubmit}
                    handleCancel={handleCloseEditUser}
                    initialData={userData}
                />
            </Dialog>

            <Dialog fullWidth maxWidth="md" open={openConfirmResetPassword} onClose={closeConfirmPasswordReset}>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={5}>
                    <Avatar>
                        <LockResetIcon />
                    </Avatar>
                    <DialogTitle
                        sx={{
                            p: 3,
                        }}
                    >
                        <Typography variant="subtitle2">
                            {t(
                                "We will send you a password reset link on the email account associated with this account. Are you sure"
                            )}
                            ?
                        </Typography>
                    </DialogTitle>
                    <Box>
                        <Button
                            variant="text"
                            size="large"
                            sx={{
                                mx: 1,
                            }}
                            onClick={closeConfirmPasswordReset}
                        >
                            {t("Cancel")}
                        </Button>
                        <ButtonSuccess
                            onClick={sendPasswordResetEmail}
                            size="large"
                            sx={{
                                mx: 1,
                                px: 3,
                            }}
                            variant="contained"
                        >
                            {t("Send")}
                        </ButtonSuccess>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

Results.propTypes = {
    users: PropTypes.array,
};

Results.defaultProps = {
    users: [],
};

export default Results;
