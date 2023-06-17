import { Box, Card, Typography, Container, styled } from "@mui/material";
import Head from "next/head";
import { useAuth } from "src/hooks/useAuth";
import { Guest } from "src/components/Guest";
import { LoginFirebaseAuth } from "src/content/Auth/Login/LoginFirebaseAuth";
import BaseLayout from "@/layouts/BaseLayout";

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

function LoginBasic() {
    const { method } = useAuth() as any;

    return (
        <>
            <Head>
                <title>Login - Basic</title>
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
                                    variant="h2"
                                    sx={{
                                        mb: 1,
                                    }}
                                >
                                    Sign in
                                </Typography>
                                <Typography
                                    variant="h4"
                                    color="text.secondary"
                                    fontWeight="normal"
                                    sx={{
                                        mb: 3,
                                    }}
                                >
                                    Fill in the fields below to sign into your account.
                                </Typography>
                            </Box>
                            {method === "Firebase" && <LoginFirebaseAuth />}
                        </Card>
                    </Container>
                </TopWrapper>
            </MainContent>
        </>
    );
}

LoginBasic.getLayout = (page) => (
    <Guest>
        <BaseLayout>{page}</BaseLayout>
    </Guest>
);

export default LoginBasic;
