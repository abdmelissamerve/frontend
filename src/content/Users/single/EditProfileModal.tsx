import { useCallback, useEffect, useRef, useState, FC } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";

import {
    Box,
    Button,
    alpha,
    Popover,
    Typography,
    styled,
    useTheme,
    TextField,
    CircularProgress,
    FormHelperText,
    Zoom,
    Grid,
    IconButton,
} from "@mui/material";

import { useSnackbar } from "notistack";
import { useAuth } from "@/hooks/useAuth";

import CloseIcon from "@mui/icons-material/Close";
import { apiInstance } from "@/api-config/api";

const EditProfileButton = styled(Button)(
    ({ theme }) => `
  width: ${theme.spacing(15)};
  padding: 0;
  height: ${theme.spacing(4)};
  margin-left: ${theme.spacing(1)};
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

interface Props {
    getProfile: Function;
}

const EditButton: FC<Props> = ({ getProfile }) => {
    const { user } = useAuth();

    const [isOpen, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
        console.log(user);
        formik.initialValues.firstName = user?.name?.slice(0, user?.name.indexOf(" "));
        formik.initialValues.lastName = user?.name?.slice(user?.name.indexOf(" ") + 1);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            submit: null,
        },
        validationSchema: Yup.object({
            firstName: Yup.string().max(255),
            lastName: Yup.string().max(255),
        }),
        onSubmit: async (_values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
            try {
                await apiInstance.updateYourProfile({
                    firstName: _values.firstName,
                    lastName: _values.lastName,
                });
                setStatus({ success: true });
                setSubmitting(false);
                handleEditUserSuccess();
                await getProfile();
                setOpen(false);
            } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
            }
        },
    });

    const handleEditUserSuccess = () => {
        enqueueSnackbar("The user was edited successfully", {
            variant: "success",
            anchorOrigin: {
                vertical: "top",
                horizontal: "right",
            },
            TransitionComponent: Zoom,
            autoHideDuration: 1000,
        });
    };

    return (
        <>
            <EditProfileButton color="primary" onClick={handleOpen}>
                <Typography variant="inherit">Edit your profile</Typography>
            </EditProfileButton>
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
                            onClick={() => setOpen(!isOpen)}
                        ></Button>

                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{
                                        marginBottom: 0,
                                        marginTop: 1,
                                        backgroundColor: "white",
                                        borderRadius: 1,
                                    }}
                                    error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                                    fullWidth
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                    label={"First name"}
                                    placeholder={"Your first name..."}
                                    margin="normal"
                                    name="firstName"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="firstName"
                                    variant="outlined"
                                    value={formik.values.firstName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{
                                        marginBottom: 0,
                                        backgroundColor: "white",
                                        borderRadius: 1,
                                    }}
                                    fullWidth
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                    label={"Last name"}
                                    placeholder={"Your last name..."}
                                    margin="normal"
                                    name="lastName"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="lastName"
                                    variant="outlined"
                                    value={formik.values.lastName}
                                />
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
                                Change profile
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
};

export default EditButton;
