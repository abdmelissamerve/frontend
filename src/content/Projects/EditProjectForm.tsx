import { FieldArray, Formik, FormikHelpers, FormikValues, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import {
    Grid,
    DialogContent,
    TextField,
    CircularProgress,
    Button,
    useTheme,
    DialogActions,
    Typography,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Zoom,
    Autocomplete,
    FormHelperText,
} from "@mui/material";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";
import DatePicker from "@mui/lab/DatePicker";
import { updateProject } from "@/services/user/projects";
import { updateProject as updateAdminProject } from "@/services/admin/projects";
import { useRefMounted } from "@/hooks/useRefMounted";
import { useSnackbar } from "notistack";
import { AbilityContext } from "@/contexts/Can";
import { useContext, useEffect, useState } from "react";

const statusOptions = [
    { label: "Open", value: "Open" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
];

export default function EditProjectForm(props) {
    const ability = useContext(AbilityContext);
    const { getProjectsList }: any = props;
    const { enqueueSnackbar } = useSnackbar();
    const { initialData, handleClose }: any = props;
    const isMountedRef = useRefMounted();
    const theme = useTheme();
    const [usersList, setUsersList] = useState<any>([]);

    const initialValues = {
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
        };

        try {
            if (ability.can("manage", "all")) {
                data["user"] = values.assigne.value;
                await updateAdminProject(data, initialData.id);
            } else {
                await updateProject(data, initialData.id);
            }
            helpers.setSubmitting(true);
            helpers.setErrors({});
            helpers.setStatus({ success: true });
            helpers.setTouched({});
            handleClose();
            getProjectsList();
            if (isMountedRef()) {
                enqueueSnackbar("Project added successfully", {
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
                enqueueSnackbar("Project could not be added", {
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
        if (props?.usersList?.length > 0) {
            setUsersList(
                props?.usersList?.map((user) => ({
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
                                            <b>Assign to:</b>
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
                                            options={usersList || []}
                                            getOptionLabel={(option) => option.label || ""}
                                            defaultValue={values.assigne || null}
                                            onChange={(event, value) => {
                                               
                                                setFieldValue("assigne", value);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    {...params}
                                                    label="Assigne"
                                                    error={touched.assigne && !!errors.assigne}
                                                    helperText={touched.assigne && errors.assigne?.label}
                                                />
                                            )}
                                        />
                                        <Typography
                                            color="text.secondary"
                                            sx={{
                                                mt: 1,
                                                ml: 1,
                                            }}
                                        >
                                            Note that if you change the assignee, the tasks will be automatically
                                            assigned to the new user.
                                        </Typography>
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
                                Edit project
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={Boolean(errors.submit) || isSubmitting}
                                variant="contained"
                            >
                                Add project
                            </Button>
                        )}
                    </DialogActions>
                </form>
            )}
        </Formik>
    );
}
