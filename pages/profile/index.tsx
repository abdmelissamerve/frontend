import {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  ChangeEvent
} from 'react';
import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Avatar
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Text from 'src/components/Text';
import { Authenticated } from 'src/components/Authenticated';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import Head from 'next/head';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import PageProfileHeader from '@/content/Management/Users/PageProfileHeader';
import { fetchCurrentUser } from '@/services/users';
import { useRefMounted } from 'src/hooks/useRefMounted';

function EditProfileTab() {
  const isMountedRef = useRefMounted();
  const { t }: { t: any } = useTranslation();
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
                  p: 4
                }}
              >
                <Grid
                  container
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  flexDirection={'row'}
                >
                  <Grid
                    xs={6}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Avatar
                      sx={{
                        width: 150,
                        height: 150,
                        mb: 2,
                        mx: 10
                      }}
                      alt={profile?.email}
                      src={profile?.photo_url}
                    />
                  </Grid>

                  <Grid xs={6} marginLeft="">
                    <Typography variant="subtitle2">
                      <Grid container spacing={0}>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={3}
                          textAlign={{ sm: 'right' }}
                        >
                          <Box pr={3} pb={2}>
                            {t('First Name')}:
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                          <Text color="black">
                            <b>{profile?.firstName}</b>
                          </Text>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={3}
                          textAlign={{ sm: 'right' }}
                        >
                          <Box pr={3} pb={2}>
                            {t('Last Name')}:
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                          <Text color="black">
                            <b>{profile?.lastName}</b>
                          </Text>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={3}
                          textAlign={{ sm: 'right' }}
                        >
                          <Box pr={3} pb={2}>
                            {t('Email address')}:
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                          <Box
                            sx={{
                              maxWidth: { xs: 'auto', sm: 300 }
                            }}
                          >
                            <Text color="black">{profile?.email}</Text>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={3}
                          textAlign={{ sm: 'right' }}
                        >
                          <Box pr={3} pb={2}>
                            {t('Password')}:
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                          <Box
                            sx={{
                              maxWidth: { xs: 'auto', sm: 300 }
                            }}
                          >
                            <Text color="black">{t('********')}</Text>
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
