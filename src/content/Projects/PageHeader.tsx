import { useState, FC } from "react";

import { Grid, Dialog, DialogTitle, Zoom, Typography, Button } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

const AddProjectForm = dynamic(() => import("./AddProjectForm"), {
    ssr: false,
});

interface Props {
    getProjectsList: Function;
    usersList: any;
}

const PageHeader: FC<Props> = ({ getProjectsList, usersList }: Props) => {
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
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        Projects
                    </Typography>
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
                        Create project
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
                        Add new project
                    </Typography>
                    <Typography variant="subtitle2">
                        Fill in the fields below to create and add a new user to the site
                    </Typography>
                </DialogTitle>

                <Dialog fullWidth maxWidth="md" open={open} onClose={() => {}}>
                    <DialogTitle
                        sx={{
                            p: 2,
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Add a new project
                        </Typography>
                        <Typography variant="subtitle2">Fill in the fields below to create a new project.</Typography>
                    </DialogTitle>
                    <AddProjectForm
                        handleClose={handleCreateProjectClose}
                        getProjectsList={getProjectsList}
                        usersList={usersList}
                    />
                </Dialog>
            </Dialog>
        </>
    );
};

export default PageHeader;
