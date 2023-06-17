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
import { updateUser, deleteUser } from "@/services/admin/users";

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
        console.log(user);
        setUserData({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,

            role: {
                label: user.role === "admin" ? "Admin" : "User",
                value: user.role === "admin" ? "admin" : "user",
            },
            phoneNumber: user.phoneNumber,
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
        try {
            await deleteUser(userData.id);
            await getUsersList({});
            closeConfirmDelete();
            enqueueSnackbar("The user was deleted successfully", {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
                TransitionComponent: Zoom,
                autoHideDuration: 1000,
            });
        } catch (err) {
            enqueueSnackbar(err?.data?.error, {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
                TransitionComponent: Zoom,
                autoHideDuration: 1000,
            });
            closeConfirmDelete();
            console.error(err?.data?.error);
        }
    };

    const handleEditFormSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
            let data: any = {
                firstName: _values.firstName,
                lastName: _values.lastName,
                role: _values.role.value,
                phoneNumber: _values.phoneNumber,
            };

            console.log(data);
            await updateUser(data, userData.id);
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

    interface Data {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
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
            id: "firstName",
            label: "Name",
            align: "left",
        },
        {
            id: "email",
            label: "Email",
            align: "left",
        },

        {
            id: "role",
            label: "Role",
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

                                                <TableCell>
                                                    <Typography>
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </Typography>
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

                                                        <Tooltip title="Delete" arrow>
                                                            <IconButton
                                                                // disabled={user.role === "admin"}
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
