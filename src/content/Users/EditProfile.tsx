import { MouseEventHandler } from "react";
import { Formik, FormikHelpers, FormikValues } from "formik";

import {
    Grid,
    DialogContent,
    TextField,
    CircularProgress,
    Button,
    useTheme,
    DialogActions,
    Typography,
    Autocomplete,
    MenuItem,
    styled,
} from "@mui/material";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";

interface FormProps {
    editUser(values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any>;

    handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;

    initialData?: object;
}

const defaultProps = {
    editUser: () => {},
    handleCancel: () => {},
    errorMessage: "",
    initialData: {},
};

const superUserOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
];

const activeOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
];

const EditProfileForm = (props: FormProps = defaultProps) => {
    const { editUser, handleCancel, initialData } = props;

    const initialValues = {
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        is_active: { label: "Inactive", value: false },
        is_superuser: { label: "No", value: "false" },
        submit: null,
        ...initialData,
    };

    const validationSchema = Yup.object().shape({
        first_name: Yup.string().max(255).required("The first name field is required"),
        last_name: Yup.string().max(255).required("The last name field is required"),
    });

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={editUser}
            validationSchema={validationSchema}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
                <form onSubmit={handleSubmit}>
                    <DialogContent
                        dividers
                        sx={{
                            p: 3,
                        }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={Boolean(touched.first_name && errors.first_name)}
                                    fullWidth
                                    helperText={touched.first_name && errors.first_name}
                                    label={"First name"}
                                    name="first_name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.first_name}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={Boolean(touched.last_name && errors.last_name)}
                                    fullWidth
                                    helperText={touched.last_name && errors.last_name}
                                    label={"Last name"}
                                    name="last_name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.last_name}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    disablePortal
                                    options={activeOptions}
                                    getOptionLabel={(option) => option.label || ""}
                                    defaultValue={values.is_active}
                                    onChange={(event, value) => {
                                        setFieldValue("is_active", value);
                                    }}
                                    renderInput={(params) => <TextField fullWidth {...params} label={"Active"} />}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    disablePortal
                                    options={superUserOptions}
                                    getOptionLabel={(option) => option.label || ""}
                                    defaultValue={values.is_superuser}
                                    onChange={(event, value) => {
                                        setFieldValue("is_superuser", value);
                                    }}
                                    renderInput={(params) => <TextField fullWidth {...params} label={"Super User"} />}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            p: 3,
                        }}
                    >
                        <Button color="secondary" onClick={(event) => handleCancel(event)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                            disabled={Boolean(errors.submit) || isSubmitting}
                            variant="contained"
                        >
                            Update user
                        </Button>
                    </DialogActions>
                </form>
            )}
        </Formik>
    );
};

export default EditProfileForm;
