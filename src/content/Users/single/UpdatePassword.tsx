import { useRef, useState } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);

import {
    Box,
    Button,
    alpha,
    Popover,
    Typography,
    styled,
    TextField,
    CircularProgress,
    FormHelperText,
    Zoom,
    Grid,
} from "@mui/material";

import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";

const EditPasswordButton = styled(Button)(
    ({ theme }) => `
  width: ${theme.spacing(20)};
  padding: 0;
  height: ${theme.spacing(4)};
  margin-left: ${theme.spacing(3)};
  border-radius: ${theme.general.borderRadiusLg};
  border: ${theme.colors.primary.main} solid 2px;
  &:hover {
    color: ${theme.colors.primary.main};
  }
`
);
const EditProfileBox = styled(Box)(
    ({ theme }) => `
          background: ${alpha(theme.colors.alpha.black[100], 0.08)};
          padding-top: ${theme.spacing(1)};
          padding-bottom: ${theme.spacing(2)};
          padding-left: ${theme.spacing(2)};
          padding-right: ${theme.spacing(2)};
  `
);

function UpdateButton() {
    const auth = getAuth();
    const user = auth.currentUser;
    const ref = useRef<any>(null);
    const [isOpen, setOpen] = useState<boolean>(false);
    const handleOpen = (): void => {
        setOpen(true);
    };

    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
            submit: null,
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required("This field is required!")
                .min(
                    8,

                    "Password must contain 8 or more characters with at least one of each: uppercase, lowercase and number."
                )
                .minLowercase(
                    1,

                    "Password must contain 8 or more characters with at least one of each: uppercase, lowercase and number."
                )
                .minUppercase(
                    1,

                    "Password must contain 8 or more characters with at least one of each: uppercase, lowercase and number."
                )
                .minNumbers(
                    1,

                    "Password must contain 8 or more characters with at least one of each: uppercase, lowercase and number."
                ),
            confirmPassword: Yup.string()
                .required("This field is required!")
                .min(
                    8,
                    "Password must contain 8 or more characters with at least one of each: uppercase, lowercase and number."
                )
                .minLowercase(
                    1,
                    "Password must contain 8 or more characters with at least one of each: uppercase, lowercase and number."
                )
                .minUppercase(
                    1,
                    "Password must contain 8 or more characters with at least one of each: uppercase, lowercase and number."
                )
                .minNumbers(
                    1,
                    "Password must contain 8 or more characters with at least one of each: uppercase, lowercase and number."
                )
                .oneOf([Yup.ref("password")], "The passwords do not match!"),
        }),
        onSubmit: async (_values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
            try {
                {
                    updatePassword(user, _values.password)
                        .then(() => {
                            setStatus({ success: true });
                            setSubmitting(false);
                            handleUpdatePasswordSuccess();
                            window.location.reload();
                        })
                        .catch((err) => {
                            console.error(err);
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                        });
                }
            } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
            }
        },
    });

    const handleUpdatePasswordSuccess = () => {
        enqueueSnackbar("The password was edited successfully", {
            variant: "success",
            anchorOrigin: {
                vertical: "top",
                horizontal: "right",
            },
            TransitionComponent: Zoom,
            autoHideDuration: 1000,
        });
    };
    const handleClose = (): void => {
        setOpen(false);
        formik.resetForm();
    };

    return (
        <>
            <EditPasswordButton color="primary" ref={ref} onClick={handleOpen}>
                <Typography variant="inherit">Change your password</Typography>
            </EditPasswordButton>
            <Popover
                disableScrollLock
                onClose={handleClose}
                open={isOpen}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
            >
                <EditProfileBox>
                    <Grid
                        container
                        sx={{
                            maxWidth: 400,
                            maxHeight: 400,
                            minWidth: 400,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Button
                            sx={{
                                padding: 0,
                                maxWidth: "25px",
                                maxHeight: "25px",
                                minWidth: "25px",
                                minHeight: "25px",
                                marginLeft: "auto",
                                marginRight: 0,
                            }}
                            startIcon={
                                <CloseIcon
                                    sx={{
                                        padding: 0,
                                        marginRight: "-10px",
                                    }}
                                />
                            }
                            onClick={handleClose}
                        ></Button>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{
                                        margin: 0,
                                        marginTop: 1,
                                        backgroundColor: "white",
                                        borderRadius: 1,
                                    }}
                                    error={Boolean(formik.touched.confirmPassword)}
                                    fullWidth
                                    helperText={formik.touched.password}
                                    label={"Password"}
                                    placeholder={"Your password..."}
                                    margin="normal"
                                    name="password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    variant="outlined"
                                />
                                {Boolean(formik.touched.password && formik.errors.password) && (
                                    <FormHelperText error>{formik.errors.password}</FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{
                                        marginBottom: 0,
                                        backgroundColor: "white",
                                        borderRadius: 1,
                                    }}
                                    error={Boolean(formik.touched.confirmPassword)}
                                    fullWidth
                                    helperText={formik.touched.confirmPassword}
                                    label={"Confirm password"}
                                    placeholder={"Repeat your password..."}
                                    margin="normal"
                                    name="confirmPassword"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    variant="outlined"
                                />
                                {Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword) && (
                                    <FormHelperText error>{formik.errors.confirmPassword}</FormHelperText>
                                )}
                            </Grid>
                            <Button
                                sx={{
                                    mt: 2.5,
                                }}
                                color="primary"
                                startIcon={formik.isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={formik.isSubmitting}
                                size="large"
                                fullWidth
                                type="submit"
                                variant="contained"
                            >
                                Change password
                            </Button>
                            {Boolean(formik.touched.submit && formik.errors.submit) && (
                                <FormHelperText error>{formik.errors.submit}</FormHelperText>
                            )}
                        </form>
                    </Grid>
                </EditProfileBox>
            </Popover>
        </>
    );
}

export default UpdateButton;
