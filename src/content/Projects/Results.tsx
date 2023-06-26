import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
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

import { forwardRef, ReactElement, Ref, useContext, useState } from "react";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import { AbilityContext } from "@/contexts/Can";
import { deleteProject } from "@/services/user/projects";
import { deleteProject as deleteProjectAsAdmin } from "@/services/admin/projects";
import { TransitionProps } from "@mui/material/transitions";
import EditProjectForm from "./EditProjectForm";
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

const Results = ({ projects, getProjectsList, loading, error, usersList }) => {
    const ability = useContext(AbilityContext);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
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
            await deleteProjectAsAdmin(selectedProject.id);
        } else {
            await deleteProject(selectedProject.id);
        }
        await getProjectsList({});
        setConfirmDelete(false);
        setSelectedProject(null);
    };

    return (
        <>
            <Card>
                {!projects?.length ? (
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
                                    {projects?.map((project) => {
                                        return (
                                            <TableRow key={project.id}>
                                                <TableCell align={"center"}>
                                                    <Typography>{project.id}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{project.name}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{project.description}</Typography>
                                                </TableCell>
                                                <TableCell>
  {project.status === 'Open' && <Chip label={project.status} color="primary" />}
  {project.status === 'In Progress' && <Chip label={project.status} color="warning" />}
  {project.status === 'Completed' && <Chip label={project.status} color="success" />}
</TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {moment(project.dueDate).format("DD/MM/YYYY")}
                                                    </Typography>
                                                </TableCell>
                                                {ability.can("manage", "all") && (
                                                    <TableCell>
                                                        <Typography>
                                                            {project.user?.firstName} {project.user?.lastName}
                                                        </Typography>
                                                    </TableCell>
                                                )}
                                                <TableCell align="center">
                                                    <Typography noWrap>
                                                        <Tooltip title="Edit" arrow>
                                                            <IconButton
                                                                onClick={() => {
                                                                    console.log(project);
                                                                    setOpenEdit(true);
                                                                    setSelectedProject({
                                                                        id: project.id,
                                                                        name: project.name,
                                                                        description: project.description,
                                                                        status: {
                                                                            label: project.status,
                                                                            value: project.status,
                                                                        },
                                                                        dueDate: project.dueDate,
                                                                        assigne: {
                                                                            label: `${project.user?.firstName} ${project.user?.lastName}`,
                                                                            value: project.user?.id,
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
                                                                    setSelectedProject(project);
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
                    setSelectedProject(null);
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
                            Are you sure you want to permanently delete this project? This action will also delete all
                            tasks associated with this project.
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
                                    setSelectedProject(null);
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
                    setSelectedProject(null);
                }}
            >
                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={openEdit}
                    onClose={() => {
                        setOpenEdit(false);
                        setSelectedProject(null);
                    }}
                >
                    <DialogTitle
                        sx={{
                            p: 2,
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Edit project
                        </Typography>
                        <Typography variant="subtitle2">Fill in the fields below to edit the project</Typography>
                    </DialogTitle>
                    <EditProjectForm
                        handleClose={() => setOpenEdit(false)}
                        initialData={selectedProject}
                        usersList={usersList}
                        getProjectsList={getProjectsList}
                    />
                </Dialog>
            </Dialog>
        </>
    );
};

export default Results;
