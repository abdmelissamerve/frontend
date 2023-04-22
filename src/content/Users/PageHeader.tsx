import { useState, FC } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { wait } from "src/utils/wait";
import { useAuth } from "src/hooks/useAuth";

import PropTypes from "prop-types";

import { styled, Grid, Dialog, DialogTitle, Box, Zoom, Typography, Button } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { useSnackbar } from "notistack";
import { addUsers } from "@/services/admin/users";
import dynamic from "next/dynamic";
const AddUserForm = dynamic(() => import("./AddUserForm"), {
    ssr: false,
});

interface Props {
    getUsersList: Function;
    filters: any;
    limit: any;
}

const PageHeader: FC<Props> = ({ getUsersList, filters, limit }) => {
    const { t }: { t: any } = useTranslation();
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const handleFormSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
            const data = {
                email: _values.email,
                first_name: _values.first_name,
                last_name: _values.last_name,
                password: _values.password,
                role: _values.role.value,
            };
            await addUsers(data);
            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            handleCreateUserSuccess();
            getUsersList({
                search: "",
                role: filters.role,
                is_active: filters.active,
                skip: 0,
                limit: limit,
            });
        } catch (err) {
            console.log(err);
            setStatus({ success: false });
            setErrors({ submit: err.data.detail });
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
        enqueueSnackbar(t("The user account was created successfully"), {
            variant: "success",
            anchorOrigin: {
                vertical: "top",
                horizontal: "right",
            },
            TransitionComponent: Zoom,
        });

        setOpen(false);
    };

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {t("Users List")}
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
                        {t("Create user")}
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
                        {t("Add new user")}
                    </Typography>
                    <Typography variant="subtitle2">
                        {t("Fill in the fields below to create and add a new user to the site")}
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
