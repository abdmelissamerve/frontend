import { useState, FC } from "react";

import { useTranslation } from "react-i18next";

import { Grid, Dialog, DialogTitle, Zoom, Typography, Button, Select, MenuItem } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

const AddTaskForm = dynamic(() => import("./AddTaskForm"), {
    ssr: false,
});

interface Props {
    getUsersList: Function;
    filters: any;
    limit: any;
    handleProjectChange: Function;
    projects: any;
    selectedProjectId: any;
}

const PageHeader: FC<Props> = ({ getUsersList, filters, limit, handleProjectChange, projects, selectedProjectId }) => {
    const { t }: { t: any } = useTranslation();
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const handleCreateProjectOpen = () => {
        setOpen(true);
    };

    const handleCreateProjectClose = () => {
        setOpen(false);
        setErrorMessage("");
    };

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item sx={{ display: "flex" }}>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {t("Tasks")}
                    </Typography>
                    <Grid
                        item
                        sx={{
                            mx: 2,
                            my: "auto",
                        }}
                    >
                        <Select
                            value={selectedProjectId}
                            onChange={handleProjectChange}
                            sx={{
                                minWidth: 200,
                                height: 40,
                            }}
                        >
                            {projects.map((project) => (
                                <MenuItem key={project.id} value={project.id}>
                                    {project.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 },
                        }}
                        onClick={handleCreateProjectOpen}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                    >
                        {t("Create task")}
                    </Button>
                </Grid>
            </Grid>
            <Dialog fullWidth maxWidth="md" open={open} onClose={handleCreateProjectClose}>
                <DialogTitle
                    sx={{
                        p: 3,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {t("Add new task")}
                    </Typography>
                    <Typography variant="subtitle2">
                        {t("Fill in the fields below to create and add a new user to the site")}
                    </Typography>
                </DialogTitle>

                <Dialog fullWidth maxWidth="md" open={open} onClose={() => {}}>
                    <DialogTitle
                        sx={{
                            p: 2,
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            {t("Add a new task")}
                        </Typography>
                        <Typography variant="subtitle2">
                            {t("Fill in the fields below to create a new project.")}
                        </Typography>
                    </DialogTitle>
                    <AddTaskForm handleClose={handleCreateProjectClose} />
                </Dialog>
            </Dialog>
        </>
    );
};

export default PageHeader;
