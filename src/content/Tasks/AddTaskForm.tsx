import { useContext, useEffect, useState } from "react";
import { Formik, FormikHelpers, FormikValues } from "formik";
import {
    Paper,
    Grid,
    DialogContent,
    TextField,
    CircularProgress,
    Button,
    useTheme,
    DialogActions,
    Typography,
    Checkbox,
    FormControlLabel,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Zoom,
    Autocomplete,
    FormHelperText,
} from "@mui/material";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";

import DatePicker from "@mui/lab/DatePicker";
import { addTask as addTaskAsAdmin } from "@/services/admin/tasks";

import { addTask } from "@/services/user/tasks";
import { AbilityContext } from "@/contexts/Can";
import { useRefMounted } from "@/hooks/useRefMounted";
import { useSnackbar } from "notistack";

const statusOptions = [
    { label: "Open", value: "Open" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
];

export default function AddTaskForm(props) {
    const { enqueueSnackbar } = useSnackbar();
    const ability = useContext(AbilityContext);
    const { initialData, loading, error, handleClose }: any = props;
    const isMountedRef = useRefMounted();
    const theme = useTheme();
    const [usersList, setUsersList] = useState([]);

    const initialValues = {
        name: "",
        description: "",
        dueDate: "",
        assigne: "",
        status: "",
        ...initialData,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255).required("The name field is required"),
        description: Yup.string().max(255).required("The description field is required"),
        dueDate: Yup.string().max(255).required("The due date field is required"),
        status: Yup.object()
            .shape({
                label: Yup.string().required("Status is required"),
                value: Yup.string().required("Status is required"),
            })
            .nullable()
            .required("Status is required"),
        assigne: ability.can("manage", "all")
            ? Yup.object()
                  .shape({
                      label: Yup.string().required("Assinge is required"),
                      value: Yup.string().required("Assinge is required"),
                  })
                  .nullable()
                  .required("Assinge is required")
            : null,
    });

    const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>): Promise<void> => {
        const data = {
            name: values.name,
            description: values.description,
            dueDate: values.dueDate,
            status: values.status?.value,
            project: props.selectedProjectId,
        };

        try {
            if (ability.can("manage", "all")) {
                data["user"] = values.assigne.value;
                await addTaskAsAdmin(data);
            } else {
                await addTask(data);
            }
            helpers.setSubmitting(true);
            helpers.setErrors({});
            helpers.setStatus({ success: true });
            helpers.setTouched({});
            handleClose();
            props.getTasksList({
                projectId: props.selectedProjectId,
            });
            if (isMountedRef()) {
                enqueueSnackbar("Task added successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                    TransitionComponent: Zoom,
                    autoHideDuration: 2000,
                });
            }
        } catch (error) {
            if (isMountedRef()) {
                enqueueSnackbar("Task could not be added", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                    TransitionComponent: Zoom,
                    autoHideDuration: 2000,
                });
            }
            console.log("There was an error!", error);
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: error?.data?.error });
            helpers.setSubmitting(false);
        }
    };

    useEffect(() => {
        if (props?.usersList?.users?.length > 0) {
            setUsersList(
                props?.usersList?.users?.map((user) => ({
                    label: user.firstName + " " + user.lastName,
                    value: user.id,
                }))
            );
        }
    }, [props?.usersList]);

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
                <form onSubmit={handleSubmit}>
                    <DialogContent
                        sx={{
                            p: 1.5,
                            pr: 4,
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={3} justifyContent="flex-end" textAlign={{ sm: "right" }}>
                                <Box
                                    pr={3}
                                    sx={{
                                        pt: 2,
                                    }}
                                    alignSelf="center"
                                >
                                    <b>Name:</b>
                                </Box>
                            </Grid>
                            <Grid
                                sx={{
                                    mb: `${theme.spacing(3)}`,
                                }}
                                item
                                xs={12}
                                sm={8}
                                md={9}
                            >
                                <TextField
                                    error={Boolean(touched.name && errors.name)}
                                    fullWidth
                                    helperText={touched.name && errors.name}
                                    label="Name"
                                    name="name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={3} justifyContent="flex-end" textAlign={{ sm: "right" }}>
                                <Box
                                    pr={3}
                                    sx={{
                                        pt: `${theme.spacing(2)}`,
                                    }}
                                    alignSelf="center"
                                >
                                    <b>Description:</b>
                                </Box>
                            </Grid>
                            <Grid
                                sx={{
                                    mb: `${theme.spacing(3)}`,
                                }}
                                item
                                xs={12}
                                sm={8}
                                md={9}
                            >
                                <TextField
                                    error={Boolean(touched.description && errors.description)}
                                    fullWidth
                                    helperText={touched.description && errors.description}
                                    label="Description"
                                    name="description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.description}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={3} justifyContent="flex-end" textAlign={{ sm: "right" }}>
                                <Box
                                    pr={3}
                                    sx={{
                                        pt: `${theme.spacing(2)}`,
                                    }}
                                    alignSelf="center"
                                >
                                    <b>Due Date:</b>
                                </Box>
                            </Grid>
                            <Grid
                                sx={{
                                    mb: `${theme.spacing(3)}`,
                                }}
                                item
                                xs={12}
                                sm={8}
                                md={9}
                            >
                                <DatePicker
                                    inputFormat="dd/MM/yyyy"
                                    value={values.dueDate}
                                    onChange={(value) => {
                                        setFieldValue("dueDate", value);
                                    }}
                                    label={"Due Date"}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            fullWidth
                                            name="dueDate"
                                            error={Boolean(touched.dueDate && errors.dueDate)}
                                            helperText={touched.dueDate && errors.dueDate}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={3} justifyContent="flex-end" textAlign={{ sm: "right" }}>
                                <Box
                                    pr={3}
                                    sx={{
                                        pt: `${theme.spacing(2)}`,
                                    }}
                                    alignSelf="center"
                                >
                                    <b>Status:</b>
                                </Box>
                            </Grid>
                            <Grid
                                sx={{
                                    mb: `${theme.spacing(3)}`,
                                }}
                                item
                                xs={12}
                                sm={8}
                                md={9}
                            >
                                <Autocomplete
                                    disablePortal
                                    options={statusOptions}
                                    getOptionLabel={(option) => option.label || ""}
                                    defaultValue={values.status || null}
                                    onChange={(event, value) => {
                                        setFieldValue("status", value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            {...params}
                                            label="Status"
                                            error={touched.status && !!errors.status}
                                            helperText={touched.status && errors.status?.label}
                                        />
                                    )}
                                />
                            </Grid>
                            {ability.can("manage", "all") ? (
                                <>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={3}
                                        justifyContent="flex-end"
                                        textAlign={{ sm: "right" }}
                                    >
                                        <Box
                                            pr={3}
                                            sx={{
                                                pt: `${theme.spacing(2)}`,
                                            }}
                                            alignSelf="center"
                                        >
                                            <b>Assigned to:</b>
                                        </Box>
                                    </Grid>
                                    <Grid
                                        sx={{
                                            mb: `${theme.spacing(3)}`,
                                        }}
                                        item
                                        xs={12}
                                        sm={8}
                                        md={9}
                                    >
                                        <Autocomplete
                                            disabled
                                            disablePortal
                                            options={usersList || []}
                                            getOptionLabel={(option) => option.label || ""}
                                            defaultValue={
                                                values.assigne || {
                                                    label:
                                                        props.selectedProjectUser?.firstName +
                                                        " " +
                                                        props.selectedProjectUser?.lastName,
                                                    value: props.selectedProjectUser?.id,
                                                }
                                            }
                                            onChange={(event, value) => {
                                                console.log("value", value);
                                                setFieldValue("assigne", value);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    {...params}
                                                    label="Assigned to"
                                                    error={touched.assigne && !!errors.assigne}
                                                    helperText={touched.assigne && errors.assigne?.label}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </>
                            ) : null}

                            <Grid item xs={12}>
                                <FormHelperText sx={{ textAlign: "center" }} error>
                                    {errors.submit}
                                </FormHelperText>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            p: 3,
                            borderTop: 1,
                            borderColor: "grey.300",
                        }}
                        style={{
                            position: "sticky",
                            bottom: "0px",
                            background: "white",
                            zIndex: 5,
                        }}
                    >
                        <Button color="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        {initialData ? (
                            <Button
                                type="submit"
                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={Boolean(errors.submit) || isSubmitting}
                                variant="contained"
                            >
                                Edit task
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={Boolean(errors.submit) || isSubmitting}
                                variant="contained"
                            >
                                Add task
                            </Button>
                        )}
                    </DialogActions>
                </form>
            )}
        </Formik>
    );
}
