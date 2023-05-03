import { MouseEventHandler } from "react";
import { FieldArray, Formik, FormikHelpers, FormikValues, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
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
} from "@mui/material";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";
import AddCircleIcon from "@mui/icons-material/Add";

export default function AddProjectForm(props) {
    const { initialData, onSubmit, loading, error, handleClose }: any = props;
    const theme = useTheme();
    const { t }: { t: any } = useTranslation();
    const initialValues = {
        name: "",
        description: "",
        dueDate: "",
        status: "",
        ...initialData,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255).required(t("The name field is required")),
        description: Yup.string().max(255).required(t("The description field is required")),
    });

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={() => {}}
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
                                <TextField
                                    error={Boolean(touched.dueDate && errors.dueDate)}
                                    fullWidth
                                    helperText={touched.dueDate && errors.dueDate}
                                    label={t("Due Date")}
                                    name="dueDate"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.dueDate}
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
                                <TextField
                                    error={Boolean(touched.status && errors.status)}
                                    fullWidth
                                    helperText={touched.status && errors.status}
                                    label={t("Status")}
                                    name="status"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.status}
                                    variant="outlined"
                                />
                            </Grid>

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
