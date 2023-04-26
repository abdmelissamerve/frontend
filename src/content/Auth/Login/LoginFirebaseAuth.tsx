import * as Yup from "yup";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { FC } from "react";
import {
    Box,
    Link,
    Button,
    Divider,
    FormHelperText,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    CircularProgress,
    styled,
} from "@mui/material";
import { useAuth } from "src/hooks/useAuth";
import { useRefMounted } from "src/hooks/useRefMounted";
import { useTranslation } from "react-i18next";

const ImgWrapper = styled("img")(
    ({ theme }) => `
    margin-right: ${theme.spacing(1)};
`
);

export const LoginFirebaseAuth: FC = (props) => {
    const { t }: { t: any } = useTranslation();
    const { signInWithEmailAndPassword } = useAuth() as any;
    const isMountedRef = useRefMounted();
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            terms: true,
            submit: null,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("The email provided should be a valid email address"))
                .max(255)
                .required(t("The email field is required")),
            password: Yup.string().max(255).required(t("The password field is required")),
            terms: Yup.boolean().oneOf([true], t("You must agree to our terms and conditions")),
        }),
        onSubmit: async (values, helpers): Promise<void> => {
            try {
                await signInWithEmailAndPassword(values.email, values.password);
                if (isMountedRef()) {
                    const backTo = "/profile";
                    router.push(backTo);
                }
            } catch (err) {
                if (isMountedRef()) {
                    helpers.setStatus({ success: false });
                    if (err.code === "auth/user-not-found") {
                        helpers.setErrors({ submit: t("The email address is not registered") });
                    } else if (err.code === "auth/wrong-password") {
                        helpers.setErrors({ submit: t("The password is invalid") });
                    } else {
                        helpers.setErrors({ submit: err.message });
                    }
                    helpers.setSubmitting(false);
                }
            }
        },
    });

    return (
        <Box {...props}>
            <form noValidate onSubmit={formik.handleSubmit}>
                <TextField
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label={t("Email address")}
                    placeholder={t("Your email address here...")}
                    margin="normal"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                    variant="outlined"
                />
                <TextField
                    error={Boolean(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label={t("Password")}
                    placeholder={t("Your password here...")}
                    margin="normal"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                    variant="outlined"
                />
                <Box alignItems="center" display="flex" justifyContent="space-between">
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
                            <>
                                <Typography variant="body2">
                                    {t("I accept the")}{" "}
                                    <Link href="https://pinglatency.com/terms-and-conditions">
                                        {t("terms and conditions")}
                                    </Link>
                                    .
                                </Typography>
                            </>
                        }
                    />
                    <Link href="/recover-password">
                        <b>{t("Lost password?")}</b>
                    </Link>
                </Box>
                {Boolean(formik.touched.terms && formik.errors.terms) && (
                    <FormHelperText error>{formik.errors.terms}</FormHelperText>
                )}
                <FormHelperText
                    error
                    sx={{
                        textAlign: "center",
                    }}
                >
                    {formik.errors.submit}
                </FormHelperText>
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
                    {t("Sign in")}
                </Button>
                <Typography sx={{ mt: 3, textAlign: "center" }}>
                    Don't have an account?{" "}
                    <Link href={"/register"} variant={"body1"}>
                        Create one here
                    </Link>
                </Typography>
            </form>
        </Box>
    );
};
