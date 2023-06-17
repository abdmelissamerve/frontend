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
    editUser(values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any>;
}

const defaultProps = {
    addUser: () => {},
    handleCancel: () => {},
    errorMessage: "",
    initialData: {},
    editUser: () => {},
};

const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
];

const EditUserForm = (props: FormProps = defaultProps) => {
    const { editUser, handleCancel, initialData, errorMessage } = props;
    const phoneRegExp = /^0((\([0-9]{2,3}\))|([0-9]{1,3}))*?[0-9]{3,4}?[0-9]{3,4}?$/;

    const initialValues = {
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
        phoneNumber: Yup.string()
            .required("The phone number field is required")
            .matches(phoneRegExp, "Phone number is not valid")
            .min(10)
            .max(10),

        role: Yup.object()
            .shape({
                label: Yup.string().required("Role label is required"),
                value: Yup.string().required("Role value is required"),
            })
            .nullable()
            .required("Role is required"),
    });

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={editUser}
            validationSchema={validationSchema}
        >
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
                                    disabled
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
                            <Grid item xs={12}>
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
                            Edit User
                        </Button>
                    </DialogActions>
                </form>
            )}
        </Formik>
    );
};

export default EditUserForm;
