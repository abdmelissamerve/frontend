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
    MenuItem,
    Autocomplete,
} from "@mui/material";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";

interface FormProps {
    addUser(values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any>;

    handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;
    errorMessage: any;
    initialData?: object;
}

const defaultProps = {
    addUser: () => {},
    handleCancel: () => {},
    errorMessage: "",
    initialData: {},
};

const superUserOptions = [
    { label: "Admin", value: "admin" },
    { label: "Technician", value: "technician" },
    { label: "User", value: "user" },
];

const AddUserForm = (props: FormProps = defaultProps) => {
    const { addUser, handleCancel, initialData, errorMessage } = props;

    const initialValues = {
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        role: "",
        is_active: null,
        submit: null,
        ...initialData,
    };

    const validationSchema = Yup.object().shape({
        first_name: Yup.string().max(255).required("The first name field is required"),
        last_name: Yup.string().max(255).required("The last name field is required"),
        email: Yup.string()
            .email("The email provided should be a valid email address")
            .max(255)
            .required("The email field is required"),
        password: Yup.string().max(255).required("The password field is required"),
    });

    return (
        <Formik enableReinitialize initialValues={initialValues} onSubmit={addUser} validationSchema={validationSchema}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, setFieldValue, values }) => (
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
                                    label="First name"
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
                                    label="Last name"
                                    name="last_name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.last_name}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={Boolean(touched.email && errors.email)}
                                    fullWidth
                                    helperText={touched.email && errors.email}
                                    label="Email address"
                                    name="email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="email"
                                    value={values.email}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={Boolean(touched.password && errors.password)}
                                    fullWidth
                                    helperText={touched.password && errors.password}
                                    label="Password"
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="password"
                                    value={values.password}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    disablePortal
                                    options={superUserOptions}
                                    getOptionLabel={(option) => option.label || ""}
                                    defaultValue={values.role || null}
                                    onChange={(event, value) => {
                                        setFieldValue("role", value);
                                    }}
                                    renderInput={(params) => <TextField fullWidth {...params} label="Role" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="center" color="error" variant="h4">
                                    {errors.submit}
                                </Typography>
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
                            Add new user
                        </Button>
                    </DialogActions>
                </form>
            )}
        </Formik>
    );
};

export default AddUserForm;
