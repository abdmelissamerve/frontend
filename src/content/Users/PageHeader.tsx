import { useState, FC } from "react";

import { styled, Grid, Dialog, DialogTitle, Box, Zoom, Typography, Button } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { useSnackbar } from "notistack";
import { addUser } from "@/services/admin/users";
import dynamic from "next/dynamic";
const AddUserForm = dynamic(() => import("./AddUserForm"), {
    ssr: false,
});

interface Props {
    getUsersList: Function;
}

const PageHeader: FC<Props> = ({ getUsersList }) => {
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const handleFormSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
            const data = {
                firstName: _values.firstName,
                lastName: _values.lastName,
                email: _values.email,
                password: _values.password,
                phoneNumber: _values.phoneNumber,
                role: _values.role.value,
            };

            await addUser(data);

            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            handleCreateUserSuccess();
            getUsersList({});
        } catch (err) {
            console.log(err);
            setStatus({ success: false });
            setErrors({ submit: err?.data?.error });
            setSubmitting(false);
        }
    };

    const handleCreateUserOpen = () => {
        setOpen(true);
    };

    const handleCreateUserClose = () => {
        setOpen(false);
        setErrorMessage("");
    };

    const handleCreateUserSuccess = () => {
        enqueueSnackbar("The user account was created successfully", {
            variant: "success",
            anchorOrigin: {
                vertical: "top",
                horizontal: "right",
            },
            TransitionComponent: Zoom,
            autoHideDuration: 2000,
        });

        setOpen(false);
    };

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        Users List
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
                        Create user/admin
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
                        Add new user
                    </Typography>
                    <Typography variant="subtitle2">
                        Fill in the fields below to create and add a new user to the site
                    </Typography>
                </DialogTitle>
                <AddUserForm
                    addUser={handleFormSubmit}
                    handleCancel={handleCreateUserClose}
                    errorMessage={errorMessage}
                />
            </Dialog>
        </>
    );
};

export default PageHeader;
