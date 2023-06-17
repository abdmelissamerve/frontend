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
import CloseIcon from "@mui/icons-material/Close";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useSnackbar } from "notistack";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";

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
    loading: boolean;
    error: any;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const Results: FC<ResultsProps> = ({ users, getUsersList, loading, error }) => {
    const { enqueueSnackbar } = useSnackbar();
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

    const handleDeleteCompleted = async () => {};

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
            // await updateUser(data, userData.id);
            await getUsersList({});
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
        enqueueSnackbar("The user was edited successfully", {
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
            label: "All users",
        },
        {
            value: "admin",
            label: "Admin",
        },
        {
            value: "user",
            label: "User",
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

    const handleResetPassword = (user) => {
        setUserId(user);
        setOpenConfirmResetPassword(true);
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
            <Card>
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
                                            <TableCell align={headCell.align} key={headCell.id}>
                                                <Typography>{headCell.label}</Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users?.map((user) => {
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
                                                        <Tooltip title="Edit" arrow>
                                                            <IconButton
                                                                onClick={() => handleOpenEditUser(user)}
                                                                color="primary"
                                                                size="small"
                                                                color="primary"
                                                            >
                                                                <LaunchTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Reset Password" arrow>
                                                            <IconButton
                                                                onClick={() => handleResetPassword(user)}
                                                                color="primary"
                                                            >
                                                                <LockResetIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" arrow>
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
                    </>
                )}
            </Card>

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
                            Are you sure you want to permanently delete this user account?
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
                                Cancel
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
                                Delete
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
                        Edit user
                    </Typography>
                    <Typography variant="subtitle2">
                        Change the desired fields to update the user information.
                    </Typography>
                </DialogTitle>
                <EdituserForm
                    editUser={handleEditFormSubmit}
                    handleCancel={handleCloseEditUser}
                    initialData={userData}
                />
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
