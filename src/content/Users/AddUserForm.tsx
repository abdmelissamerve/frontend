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
    FormHelperText,
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

const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
];

const AddUserForm = (props: FormProps = defaultProps) => {
    const { addUser, handleCancel, initialData, errorMessage } = props;
    const phoneRegExp = /^0((\([0-9]{2,3}\))|([0-9]{1,3}))*?[0-9]{3,4}?[0-9]{3,4}?$/;

    const initialValues = {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        phoneNumber: "",
        role: "",
        submit: null,
        ...initialData,
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, "The first name can only contain letters")
            .min(2)
            .max(50)
            .required("The first name field is required"),
        lastName: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, "The first name can only contain letters")
            .min(2)
            .max(50)
            .required("The first name field is required"),
        email: Yup.string()
            .email("The email address provided is invalid")
            .max(255)
            .required("The email field is required"),
        password: Yup.string().min(8).max(255).required("The password field is required"),
        phoneNumber: Yup.string()
            .required("The phone number field is required")
            .matches(phoneRegExp, "Phone number is not valid")
            .min(10)
            .max(10),
        role: Yup.object()
            .shape({
                label: Yup.string().required("Role is required"),
                value: Yup.string().required("Role is required"),
            })
            .nullable()
            .required("Role is required"),
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
                                    error={Boolean(touched.firstName && errors.firstName)}
                                    fullWidth
                                    helperText={touched.firstName && errors.firstName}
                                    label="First name"
                                    name="firstName"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={Boolean(touched.lastName && errors.lastName)}
                                    fullWidth
                                    helperText={touched.lastName && errors.lastName}
                                    label="Last name"
                                    name="lastName"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
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

                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    disablePortal
                                    options={roleOptions}
                                    getOptionLabel={(option) => option.label || ""}
                                    defaultValue={values.role || null}
                                    onChange={(event, value) => {
                                        setFieldValue("role", value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            {...params}
                                            label="Role"
                                            error={touched.role && !!errors.role}
                                            helperText={touched.role && errors.role?.label}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                    fullWidth
                                    helperText={touched.phoneNumber && errors.phoneNumber}
                                    label="Phone number"
                                    name="phoneNumber"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.phoneNumber}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {Boolean(touched.submit && errors.submit) && (
                                    <FormHelperText sx={{ textAlign: "center" }} error>
                                        {errors.submit}
                                    </FormHelperText>
                                )}
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
