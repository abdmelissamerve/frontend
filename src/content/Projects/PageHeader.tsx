import { useState, FC } from "react";

import { useTranslation } from "react-i18next";

import { Grid, Dialog, DialogTitle, Zoom, Typography, Button } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

const AddProjectForm = dynamic(() => import("./AddProjectForm"), {
    ssr: false,
});

interface Props {
    getUsersList: Function;
    filters: any;
    limit: any;
}

const PageHeader: FC<Props> = () => {
    const { t }: { t: any } = useTranslation();
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const handleCreateUserOpen = () => {
        setOpen(true);
    };

    const handleCreateUserClose = () => {
        setOpen(false);
        setErrorMessage("");
    };

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {t("Projects")}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 },
                        }}
                        onClick={handleCreateUserOpen}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                    >
                        {t("Create project")}
                    </Button>
                </Grid>
            </Grid>
            <Dialog fullWidth maxWidth="md" open={open} onClose={handleCreateUserClose}>
                <DialogTitle
                    sx={{
                        p: 3,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {t("Add new project")}
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
                            {t("Add a new project")}
                        </Typography>
                        <Typography variant="subtitle2">
                            {t("Fill in the fields below to create a new project.")}
                        </Typography>
                    </DialogTitle>
                    <AddProjectForm />
                </Dialog>
            </Dialog>
        </>
    );
};

export default PageHeader;
