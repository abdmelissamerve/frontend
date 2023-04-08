import { Box, Card, Typography, Container, styled, TextField, Button, Zoom } from "@mui/material";
import Head from "next/head";
import { useAuth } from "src/hooks/useAuth";
import { Guest } from "src/components/Guest";
import { useTranslation } from "react-i18next";
import BaseLayout from "@/layouts/BaseLayout";
import { apiInstance } from "@/api-config/api";
import { useState } from "react";
import { useRefMounted } from "@/hooks/useRefMounted";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

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
    const { t }: { t: any } = useTranslation();
    const [code, setCode] = useState("");

    const verifyCode = async (code: number) => {
        try {
            const response = await apiInstance.verifyCode(code);
            if (isMountedRef() && response.data.result === true) {
                enqueueSnackbar(t("Phone verified successfully"), {
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
        } catch (error) {
            console.log(error);
        }
    };

    const codeFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };
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
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        mb: 1,
                                    }}
                                >
                                    {t("Phone number verification")}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    color="text.secondary"
                                    fontWeight="normal"
                                    sx={{
                                        mb: 3,
                                    }}
                                >
                                    {t("Please input the verification code sent to your phone")}
                                </Typography>
                                <TextField
                                    fullWidth
                                    label={t("Code")}
                                    margin="normal"
                                    name="code"
                                    onChange={codeFieldChange}
                                    type="text"
                                    value={code}
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
                                    onClick={() => verifyCode(Number(code))}
                                >
                                    {t("Verify code")}
                                </Button>
                            </Box>
                        </Card>
                    </Container>
                </TopWrapper>
            </MainContent>
        </>
    );
}

PhoneVerification.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default PhoneVerification;
