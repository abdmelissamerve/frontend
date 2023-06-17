import { useState, useEffect, useCallback, SyntheticEvent, ChangeEvent } from "react";
import { Grid, Typography, CardContent, Card, Box, Divider, Avatar, Button } from "@mui/material";
import Text from "src/components/Text";
import { Authenticated } from "src/components/Authenticated";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import Head from "next/head";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import Footer from "@/components/Footer";
import PageProfileHeader from "@/content/Users/PageProfileHeader";
import { fetchCurrentUser } from "@/services/admin/users";
import { useRefMounted } from "src/hooks/useRefMounted";
import { apiInstance } from "@/api-config/api";
import { useRouter } from "next/router";

function EditProfileTab() {
    const isMountedRef = useRefMounted();
    const router = useRouter();

    const [profile, setProfile] = useState(null);

    const getProfile = useCallback(async () => {
        try {
            const response = await fetchCurrentUser();
            setProfile(response.data.user);
        } catch (err) {
            console.log(err);
        }
    }, [isMountedRef]);

    useEffect(() => {
        getProfile();
    }, []);

    const sendVerificationCode = async () => {
        try {
            await apiInstance.sendVerificationCode();
            if (isMountedRef()) {
                router.push("/phoneVerification");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Head>Your Profile</Head>
            <PageTitleWrapper>
                <PageProfileHeader getProfile={getProfile} />
            </PageTitleWrapper>

            <Grid
                item
                sx={{ px: 4 }}
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}></Grid>
            </Grid>

            {
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <Divider />
                            <CardContent
                                sx={{
                                    p: 4,
                                }}
                            >
                                <Grid
                                    container
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    flexDirection={"row"}
                                >
                                    <Grid xs={6} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                        <Avatar
                                            sx={{
                                                width: 150,
                                                height: 150,
                                                mb: 2,
                                                mx: 10,
                                            }}
                                            alt={profile?.email}
                                            src={profile?.photo_url}
                                        />
                                    </Grid>

                                    <Grid xs={6} marginLeft="">
                                        <Typography variant="subtitle2">
                                            <Grid container spacing={0}>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                                                    <Box pr={3} pb={2}>
                                                        First Name:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Text color="black">
                                                        <b>{profile?.firstName}</b>
                                                    </Text>
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                                                    <Box pr={3} pb={2}>
                                                        Last Name:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Text color="black">
                                                        <b>{profile?.lastName}</b>
                                                    </Text>
                                                </Grid>

                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                                                    <Box pr={3} pb={2}>
                                                        Email address:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Box
                                                        sx={{
                                                            maxWidth: { xs: "auto", sm: 300 },
                                                        }}
                                                    >
                                                        <Text color="black">{profile?.email}</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                                                    <Box pr={3} pb={2}>
                                                        Password:
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Box
                                                        sx={{
                                                            maxWidth: { xs: "auto", sm: 300 },
                                                        }}
                                                    >
                                                        <Text color="black">********</Text>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                                                    <Box pr={3} pb={2}>
                                                        Phone Verified
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={8} md={9}>
                                                    <Box
                                                        sx={{
                                                            maxWidth: { xs: "auto", sm: 300 },
                                                            display: "flex",
                                                        }}
                                                    >
                                                        <Text color="black">
                                                            {profile?.isPhoneVerified ? "Yes" : "No"}
                                                        </Text>
                                                        {!profile?.isPhoneVerified && (
                                                            <Button
                                                                variant="contained"
                                                                sx={{
                                                                    ml: 2,
                                                                    height: 32,
                                                                }}
                                                                onClick={sendVerificationCode}
                                                            >
                                                                Send verification code
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            }
            <Footer />
        </>
    );
}

EditProfileTab.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default EditProfileTab;
