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
} from "@mui/material";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";
import DatePicker from "@mui/lab/DatePicker";
import { addProject } from "@/services/user/projects";
import { addProject as addAminProject } from "@/services/admin/projects";
import { useRefMounted } from "@/hooks/useRefMounted";
import { useSnackbar } from "notistack";
import { AbilityContext } from "@/contexts/Can";
import { useContext } from "react";

export default function AddProjectForm(props) {
    const ability = useContext(AbilityContext);
    const { getProjectsList }: any = props;
    const { enqueueSnackbar } = useSnackbar();
    const { initialData, handleClose }: any = props;
    const isMountedRef = useRefMounted();
    const theme = useTheme();
    const { t }: { t: any } = useTranslation();
    const initialValues = {
        name: "",
        description: "",
        dueDate: "",
        assigne: "",
        status: "Open",
        ...initialData,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255).required(t("The name field is required")),
        description: Yup.string().max(255).required(t("The description field is required")),
        dueDate: Yup.string().max(255).required(t("The due date field is required")),
        status: Yup.string().max(255).required(t("The status field is required")),
        assigne: ability.can("manage", "all")
            ? Yup.string().max(255).required(t("The assigne field is required"))
            : null,
    });

    const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>): Promise<void> => {
        const data = {
            name: values.name,
            description: values.description,
            dueDate: values.dueDate,
            status: values.status,
        };

        try {
            if (ability.can("manage", "all")) {
                data["assigne"] = values.assigne;
                await addAminProject(data);
            } else {
                await addProject(data);
            }
            helpers.setSubmitting(true);
            helpers.setErrors({});
            helpers.setStatus({ success: true });
            helpers.setTouched({});
            handleClose();
            getProjectsList();
            if (isMountedRef()) {
                enqueueSnackbar(t("Project added successfully"), {
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
                enqueueSnackbar(t("Project could not be added"), {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                    TransitionComponent: Zoom,
                    autoHideDuration: 2000,
                });
            }
            console.error(error);
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: error.message });
        }
    };

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
                                    <b>{t("Name")}:</b>
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
                                    label={t("Name")}
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
                                    <b>{t("Description")}:</b>
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
                                    label={t("Description")}
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
                                    <b>{t("Due Date")}:</b>
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
                                    <b>{t("Status")}:</b>
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
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>{t("Status")}</InputLabel>
                                    <Select
                                        value={values.status}
                                        onChange={(e) => {
                                            setFieldValue("status", e.target.value);
                                        }}
                                        label={t("Status")}
                                    >
                                        <MenuItem value={"Open"}>Open</MenuItem>
                                        <MenuItem value={"In Progress"}>In Progress</MenuItem>
                                        <MenuItem value={"Completed"}>Completed</MenuItem>
                                    </Select>
                                </FormControl>
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
                                            <b>{t("Assign to")}:</b>
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
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>{t("Users")}</InputLabel>
                                            <Select
                                                value={values.assigne}
                                                onChange={(e) => {
                                                    console.log("e.target.value", e.target.value);
                                                    setFieldValue("assigne", e.target.value);
                                                }}
                                                label={t("Users")}
                                            >
                                                {props?.usersList?.map((user) => (
                                                    <MenuItem key={user.id} value={user.id}>
                                                        {user.firstName + " " + user.lastName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </>
                            ) : null}
                            <Grid item xs={12}>
                                <Typography align="center" marginTop={2} color="error" variant="h4">
                                    {errors.submit}
                                </Typography>
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
                            {t("Cancel")}
                        </Button>
                        {initialData ? (
                            <Button
                                type="submit"
                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={Boolean(errors.submit) || isSubmitting}
                                variant="contained"
                            >
                                {t("Edit project")}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={Boolean(errors.submit) || isSubmitting}
                                variant="contained"
                            >
                                {t("Add project ")}
                            </Button>
                        )}
                    </DialogActions>
                </form>
            )}
        </Formik>
    );
}
