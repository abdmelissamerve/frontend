import {
    Avatar,
    Box,
    Button,
    Card,
    Dialog,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    Slide,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { forwardRef, ReactElement, useContext, useState } from "react";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { AbilityContext } from "@/contexts/Can";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";

import { deleteTask as deleteTaskAsAdmin } from "@/services/admin/tasks";
import { deleteTask } from "@/services/user/tasks";
import EditTaskForm from "./EditTaskForm";
import moment from "moment";

const DialogWrapper = styled(Dialog)(
    () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const Results = ({ tasks, getTasksList, selectedProjectId, loading, error, usersList }) => {
    const ability = useContext(AbilityContext);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    interface Data {
        id: number;
        name: string;
        description: string;
        status: string;
        user: string;
        dueDate: string;
    }

    interface HeadCell {
        id: keyof Data;
        label: string;
        align: string;
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
            id: "name",
            label: "Name",
            align: "left",
        },
        {
            id: "description",
            label: "Description",
            align: "left",
        },
        {
            id: "status",
            label: "Status",
            align: "left",
        },
        {
            id: "dueDate",
            label: "Due Date",
            align: "left",
        },
        {
            id: "user",
            label: "User",
            align: "left",
        },
        {
            id: "actions",
            label: "Actions",
            align: "center",
        },
    ];

    const handleDeleteCompleted = async () => {
        if (ability.can("manage", "all")) {
            await deleteTaskAsAdmin(selectedTask.id);
        } else {
            await deleteTask(selectedTask.id);
        }
        await getTasksList({
            projectId: selectedProjectId,
        });
        setConfirmDelete(false);
        setSelectedTask(null);
    };

    return (
        <>
            <Card>
                {!tasks?.length ? (
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
                                        {headCells.map((headCell) => {
                                            if (headCell.label === "User" && !ability.can("manage", "all")) {
                                                return null;
                                            }
                                            return (
                                                <TableCell align={headCell.align} key={headCell.id}>
                                                    <Typography>{headCell.label}</Typography>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasks?.map((task) => {
                                        return (
                                            <TableRow key={task.id}>
                                                <TableCell align={"center"}>
                                                    <Typography>{task.id}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{task.name}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{task.description}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{task.status}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{moment(task.dueDate).format("DD/MM/YYYY")}</Typography>
                                                </TableCell>
                                                {ability.can("manage", "all") && (
                                                    <TableCell>
                                                        <Typography>
                                                            {task.user?.firstName} {task.user?.lastName}
                                                        </Typography>
                                                    </TableCell>
                                                )}
                                                <TableCell align="center">
                                                    <Typography noWrap>
                                                        <Tooltip title="Edit" arrow>
                                                            <IconButton
                                                                onClick={() => {
                                                                    setOpenEdit(true);
                                                                    setSelectedTask({
                                                                        id: task.id,
                                                                        name: task.name,
                                                                        description: task.description,
                                                                        status: {
                                                                            label: task.status,
                                                                            value: task.status,
                                                                        },
                                                                        dueDate: task.dueDate,
                                                                        assigne: {
                                                                            label: `${task.user?.firstName} ${task.user?.lastName}`,
                                                                            value: task.user?.id,
                                                                        },
                                                                    });
                                                                }}
                                                                color="primary"
                                                                size="small"
                                                                color="primary"
                                                            >
                                                                <LaunchTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" arrow>
                                                            <IconButton
                                                                onClick={() => {
                                                                    setConfirmDelete(true);
                                                                    setSelectedTask(task);
                                                                }}
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
                open={confirmDelete}
                maxWidth="sm"
                fullWidth
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    setConfirmDelete(false);
                    setSelectedTask(null);
                }}
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
                            Are you sure you want to permanently delete this task?
                        </Typography>

                        <Box>
                            <Button
                                variant="text"
                                size="small"
                                sx={{
                                    mx: 1,
                                }}
                                onClick={() => {
                                    setConfirmDelete(false);
                                    setSelectedTask(null);
                                }}
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

            <Dialog
                fullWidth
                maxWidth="md"
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false);
                    setSelectedTask(null);
                }}
            >
                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={openEdit}
                    onClose={() => {
                        setOpenEdit(false);
                        setSelectedTask(null);
                    }}
                >
                    <DialogTitle
                        sx={{
                            p: 2,
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Edit task
                        </Typography>
                        <Typography variant="subtitle2">Fill in the fields below to edit the task</Typography>
                    </DialogTitle>
                    <EditTaskForm
                        handleClose={() => setOpenEdit(false)}
                        initialData={selectedTask}
                        getTasksList={getTasksList}
                        usersList={usersList}
                        selectedProjectId={selectedProjectId}
                    />
                </Dialog>
            </Dialog>
        </>
    );
};

export default Results;
