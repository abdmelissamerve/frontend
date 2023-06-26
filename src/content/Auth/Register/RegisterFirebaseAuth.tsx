import * as Yup from "yup";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { FC } from "react";
import Link from "src/components/Link";

import {
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Box,
    FormHelperText,
    Typography,
    CircularProgress,
    Grid,
} from "@mui/material";
import { useAuth } from "src/hooks/useAuth";
import { useRefMounted } from "src/hooks/useRefMounted";

import { apiInstance } from "@/api-config/api";

export const RegisterFirebaseAuth: FC = (props) => {
    const { signInWithEmailAndPassword } = useAuth() as any;
    const isMountedRef = useRefMounted();
    const router = useRouter();
    const phoneRegExp = /^0((\([0-9]{2,3}\))|([0-9]{1,3}))*?[0-9]{3,4}?[0-9]{3,4}?$/;

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            terms: true,
            submit: null,
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .matches(/^[a-zA-Z\s]+$/, "The first name can only contain letters")
                .min(2)
                .max(50)
                .required("The first name field is required"),
            phoneNumber: Yup.string()
                .min(10)
                .max(10)
                .matches(phoneRegExp, "Phone number is not valid")
                .required("The phone number field is required"),

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
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("The password confirmation field is required"),

            terms: Yup.boolean().oneOf([true], "You must agree to our terms and conditions"),
        }),
        onSubmit: async (values, helpers): Promise<void> => {
            const data = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                phoneNumber: values.phoneNumber,
            };
            try {
                const user = await apiInstance.registerUser(data);
                if (user) {
                    await signInWithEmailAndPassword(values.email, values.password);
                    await apiInstance.sendVerificationCode();
                }
                if (isMountedRef() && user) {
                    router.push("/phoneVerification");
                }
            } catch (err) {
                console.error("err", err);
                if (isMountedRef()) {
                    helpers.setStatus({ success: false });
                    helpers.setErrors({ submit: err?.data?.error });
                    helpers.setSubmitting(false);
                }
            }
        },
    });

    return (
        <Box {...props}>
            <form noValidate onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                            fullWidth
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            label="First Name"
                            placeholder="Your first name here..."
                            margin="normal"
                            name="firstName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.firstName}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                            fullWidth
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            label="Last Name"
                            placeholder="Your last name here..."
                            margin="normal"
                            name="lastName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.lastName}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: 0 }}>
                        <TextField
                            error={Boolean(formik.touched.email && formik.errors.email)}
                            fullWidth
                            helperText={formik.touched.email && formik.errors.email}
                            label="Email"
                            placeholder="Your email here..."
                            margin="normal"
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="email"
                            value={formik.values.email}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} lg={12} style={{ paddingTop: 0 }}>
                        <TextField
                            error={Boolean(formik.touched.password && formik.errors.password)}
                            fullWidth
                            helperText={formik.touched.password && formik.errors.password}
                            label="Password"
                            placeholder="Your password here..."
                            margin="normal"
                            name="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.password}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} lg={12} style={{ paddingTop: 0 }}>
                        <TextField
                            error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                            fullWidth
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            label="Confirm Password"
                            placeholder="Re-enter your password here..."
                            margin="normal"
                            name="confirmPassword"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.confirmPassword}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} lg={12} style={{ paddingTop: 0 }}>
                        <TextField
                            error={Boolean(formik.touched.phoneNumber && formik.errors.phoneNumber)}
                            fullWidth
                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                            label="Phone Number"
                            placeholder="Your phone number here..."
                            margin="normal"
                            name="phoneNumber"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.phoneNumber}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formik.values.terms}
                            name="terms"
                            color="primary"
                            onChange={formik.handleChange}
                        />
                    }
                    label={
                        <Typography variant="body2">
                            I accept the{" "}
                            <Link href="https://pinglatency.com/terms-and-conditions">terms and conditions</Link>.
                        </Typography>
                    }
                />
                {Boolean(formik.touched.terms && formik.errors.terms) && (
                    <FormHelperText error>{formik.errors.terms}</FormHelperText>
                )}
                <Button
                    sx={{
                        mt: 3,
                    }}
                    color="primary"
                    startIcon={formik.isSubmitting ? <CircularProgress size="1rem" /> : null}
                    disabled={formik.isSubmitting}
                    size="large"
                    fullWidth
                    type="submit"
                    variant="contained"
                >
                    Create account
                </Button>
                {Boolean(formik.touched.submit && formik.errors.submit) && (
                    <FormHelperText sx={{ textAlign: "center" }} error>
                        {formik.errors.submit}
                    </FormHelperText>
                )}
                <Typography sx={{ mt: 3, textAlign: "center" }}>
                    Already have an account?{" "}
                    <Link href={"/login"} variant={"body1"}>
                        Sign in here
                    </Link>
                </Typography>
            </form>
        </Box>
    );
};
