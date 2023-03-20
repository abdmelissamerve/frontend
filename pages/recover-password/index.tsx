import { useState, forwardRef, Ref } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  TextField,
  Typography,
  Container,
  Alert,
  Slide,
  Dialog,
  Collapse,
  Button,
  Avatar,
  IconButton,
  styled
} from '@mui/material';
import Head from 'next/head';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import { TransitionProps } from '@mui/material/transitions';
import { useRefMounted } from 'src/hooks/useRefMounted';
import CloseIcon from '@mui/icons-material/Close';
import { Guest } from 'src/components/Guest';
import Link from 'src/components/Link';
import { useRouter } from 'next/router';

import { useTranslation } from 'react-i18next';
import Logo from 'src/components/LogoSign';
import { useAuth } from 'src/hooks/useAuth';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const MainContent = styled(Box)(
  () => `
      height: 100%;
      display: flex;
      flex: 1;
      flex-direction: column;
  `
);
const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
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

function RecoverPasswordBasic() {
  const { t }: { t: any } = useTranslation();
  const isMountedRef = useRefMounted();
  const router = useRouter();
  const { demo } = router.query;
  const { sendPasswordResetEmail, user } = useAuth() as any;
  const [openAlert, setOpenAlert] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Head>
        <title>Recover Password</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <Logo />
            <Card
              sx={{
                mt: 3,
                px: 4,
                pt: 5,
                pb: 3
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Recover Password')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t(
                    'Enter the email used for registration to receive the reset link.'
                  )}
                </Typography>
              </Box>

              <Formik
                initialValues={{
                  email: '',
                  submit: null
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email(
                      t('The email provided should be a valid email address')
                    )
                    .max(255)
                    .required(t('The email field is required'))
                })}
                onSubmit={async (
                  _values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    await sendPasswordResetEmail(_values.email);
                    handleOpenDialog();
                    if (isMountedRef()) {
                      setStatus({ success: true });
                      setSubmitting(false);
                    }
                  } catch (err) {
                    console.error(err);
                    if (isMountedRef()) {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    }
                  }
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  touched,
                  values
                }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label={t('Email address')}
                      margin="normal"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                      variant="outlined"
                    />

                    <Button
                      sx={{
                        mt: 3
                      }}
                      color="primary"
                      disabled={Boolean(touched.email && errors.email)}
                      type="submit"
                      fullWidth
                      size="large"
                      variant="contained"
                    >
                      {t('Send me a link.')}
                    </Button>
                  </form>
                )}
              </Formik>
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>

      <DialogWrapper
        open={openDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
      >
        <Box
          sx={{
            px: 4,
            pb: 4,
            pt: 2
          }}
        >
          <Collapse in={openAlert}>
            <Alert sx={{ my: 4 }}>
              {t(
                'The password reset instructions have been sent to your email. Check your email for further instructions.'
              )}
            </Alert>
          </Collapse>

          <Button
            fullWidth
            component={Link}
            variant="contained"
            onClick={handleCloseDialog}
            href={'/login'}
          >
            {t('Back to login')}
          </Button>
        </Box>
      </DialogWrapper>
    </>
  );
}

RecoverPasswordBasic.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default RecoverPasswordBasic;
