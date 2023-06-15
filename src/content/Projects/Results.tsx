import {
    Avatar,
    Box,
    Button,
    Card,
    Dialog,
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
import { useTranslation } from "next-i18next";
import { forwardRef, ReactElement, Ref, useContext, useState } from "react";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import { AbilityContext } from "@/contexts/Can";
import { deleteProject } from "@/services/user/projects";
import { deleteProject as deleteProjectAsAdmin } from "@/services/admin/projects";
import { TransitionProps } from "@mui/material/transitions";

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

const Results = ({
    projects,
    getProjectsList,
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
    const { t }: { t: any } = useTranslation();
    const ability = useContext(AbilityContext);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

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
                <Box p={2}>
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
                        onChange={() => {}}
                        placeholder={t("Search by name")}
                        size="small"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </Box>

                <Divider />

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
                                                    <Typography>{project.status}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{project.dueDate}</Typography>
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
                                                        <Tooltip title={t("Edit")} arrow>
                                                            <IconButton
                                                                onClick={() => {}}
                                                                color="primary"
                                                                size="small"
                                                                color="primary"
                                                            >
                                                                <LaunchTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={t("Delete")} arrow>
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
                        <Box p={2}>
                            <TablePagination
                                component="div"
                                count={-1}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleLimitChange}
                                page={page}
                                rowsPerPage={limit}
                                rowsPerPageOptions={[5, 15, 30]}
                            />
                        </Box>
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
                            {t("Are you sure you want to permanently delete this project")}?
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
        </>
    );
};

export default Results;
