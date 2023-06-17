import { Box, Card, Typography, Container, styled, TextField, Button, Zoom, CircularProgress } from "@mui/material";
import Head from "next/head";
import BaseLayout from "@/layouts/BaseLayout";
import { apiInstance } from "@/api-config/api";
import { useState } from "react";
import { useRefMounted } from "@/hooks/useRefMounted";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as Yup from "yup";

const MainContent = styled(Box)(
    () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
    () => `
  display: flex;
  width: 100%;
  flex: 1;
  padding: 20px;
`
);

function PhoneVerification() {
    const { enqueueSnackbar } = useSnackbar();
    const isMountedRef = useRefMounted();
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            code: "",
            submit: null,
        },
        validationSchema: Yup.object({
            code: Yup.string()
                .matches(/^\d{6}$/, "The code must be a 6-digit number")
                .required("The code field is required"),
        }),
        onSubmit: async (values, helpers): Promise<void> => {
            try {
                const response = await apiInstance.verifyCode(values.code);
                if (isMountedRef() && response.data.result === true) {
                    enqueueSnackbar("Phone verified successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right",
                        },
                        TransitionComponent: Zoom,
                        autoHideDuration: 2000,
                    });
                    router.push("/profile");
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
        <>
            <Head>
                <title>Phone Verification - Basic</title>
            </Head>
            <MainContent>
                <TopWrapper>
                    <Container maxWidth="sm">
                        <Card
                            sx={{
                                mt: 3,
                                px: 4,
                                pt: 5,
                                pb: 3,
                            }}
                        >
                            <form noValidate onSubmit={formik.handleSubmit}>
                                <Box>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            mb: 1,
                                        }}
                                    >
                                        Phone number verification
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color="text.secondary"
                                        fontWeight="normal"
                                        sx={{
                                            mb: 3,
                                        }}
                                    >
                                        "Please input the verification code sent to your phone"
                                    </Typography>
                                    <TextField
                                        error={Boolean(formik.touched.code && formik.errors.code)}
                                        fullWidth
                                        helperText={formik.touched.code && formik.errors.code}
                                        label="Code"
                                        placeholder="Input code here..."
                                        margin="normal"
                                        name="code"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.code}
                                        variant="outlined"
                                    />
                                    <Button
                                        sx={{
                                            mt: 3,
                                        }}
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        startIcon={formik.isSubmitting ? <CircularProgress size="1rem" /> : null}
                                        disabled={formik.isSubmitting}
                                    >
                                        "Verify code"
                                    </Button>
                                </Box>
                            </form>
                        </Card>
                    </Container>
                </TopWrapper>
            </MainContent>
        </>
    );
}

PhoneVerification.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default PhoneVerification;
