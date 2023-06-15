import { useState, FC, useContext } from "react";

import { useTranslation } from "react-i18next";

import { Grid, Dialog, DialogTitle, Zoom, Typography, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";
import { AbilityContext } from "@/contexts/Can";

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
    selectedProjectName: any;
    usersList: any;
    getTasksList: Function;
}

const PageHeader: FC<Props> = ({
    getUsersList,
    filters,
    limit,
    handleProjectChange,
    projects,
    selectedProjectId,
    selectedProjectName,
    usersList,
    getTasksList
}) => {
    const { t }: { t: any } = useTranslation();
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const ability = useContext(AbilityContext);
    

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
                <Grid item >
                    <Typography variant="h3" component="h3" gutterBottom>
                        Tasks for project -> {selectedProjectName}
                    </Typography>
                 
                </Grid>
                <Grid item sx={{ display: "flex" }}>
                <Grid
                        item
                        sx={{
                            mx: 2,
                            my: "auto",
                        }}
                    >
                    
                         <FormControl fullWidth variant="outlined">
                                    <InputLabel>{t("Projects")}</InputLabel>
                                    <Select
                                     sx={{
                                        minWidth: 200,
                                        height: 40,
                                    }}
                                        value={selectedProjectId}
                                        onChange={handleProjectChange}
                                        label={t("Projects")}
                                    >
                            {projects.map((project) => (
                                <MenuItem key={project.id} value={project.id}
                                
                                >
                                    {ability.can("manage", "all")
                                        ? project.name + " -> " + project.user?.firstName + " " + project.user?.lastName
                                        : project.name}
                                </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        
                    </Grid>
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
                    <AddTaskForm handleClose={handleCreateProjectClose}
                    getTasksList = {getTasksList}
                    usersList   = {usersList}
                    selectedProjectId = {selectedProjectId}
                    />
                </Dialog>
            </Dialog>
        </>
    );
};

export default PageHeader;
