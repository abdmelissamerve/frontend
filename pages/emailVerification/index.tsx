import { Box, Card, Typography, Container, styled, TextField, Button, Zoom } from "@mui/material";
import Head from "next/head";
import { Guest } from "src/components/Guest";
import { useTranslation } from "react-i18next";
import BaseLayout from "@/layouts/BaseLayout";
import { apiInstance } from "@/api-config/api";
import { useEffect, useState } from "react";
import { useRefMounted } from "@/hooks/useRefMounted";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useAuth } from "@/hooks/useAuth";

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

function EmailVerification() {
    const { applyActionCode, user } = useAuth() as any;
    const { enqueueSnackbar } = useSnackbar();
    const isMountedRef = useRefMounted();
    const router = useRouter();
    const { t }: { t: any } = useTranslation();
    const { oobCode } = router.query;

    useEffect(() => {
        const checkEmailVerification = async () => {
            try {
                await applyActionCode(oobCode);
            } catch (error) {
                console.log(error);
            }
        };

        const handleVerification = async () => {
            if (oobCode && user.emailVerified === false) {
                await checkEmailVerification();
            }
            console.log("USER", user);
            if (isMountedRef() && user.emailVerified === true) {
                enqueueSnackbar(t("Email verified successfully"), {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                    TransitionComponent: Zoom,
                    autoHideDuration: 2000,
                });
                await apiInstance.sendVerificationCode();
                router.push("/phoneVerification");
            }
        };

        handleVerification();
    }, [oobCode, router, user.emailVerified, user.isPhoneVerified]);

    return (
        <>
            <Head>
                <title>Email Verification</title>
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
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        mb: 1,
                                    }}
                                >
                                    {t("Email verification")}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    color="text.secondary"
                                    fontWeight="normal"
                                    sx={{
                                        mb: 3,
                                    }}
                                >
                                    {t(
                                        "We've sent a verification link to your email. Please check your email and click on the link to verify your email."
                                    )}
                                </Typography>
                            </Box>
                        </Card>
                    </Container>
                </TopWrapper>
            </MainContent>
        </>
    );
}

EmailVerification.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default EmailVerification;
