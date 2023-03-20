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
import { apiInstance } from '@/config/api';

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

function NewPassword() {
  const { t }: { t: any } = useTranslation();
  const isMountedRef = useRefMounted();
  const router = useRouter();
  const { demo } = router.query;

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
        <title>New Password</title>
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
                  {t('Change Password')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Enter the new password.')}
                </Typography>
              </Box>

              <Formik
                initialValues={{
                  newPassword: '',
                  confirmPassword: '',
                  submit: null
                }}
                validationSchema={Yup.object().shape({
                  newPassword: Yup.string()
                    .min(8, 'Password is too short')
                    .max(30, 'Password is too long')
                    .required(t('The password field is required')),
                  confirmPassword: Yup.string()
                    .required(t('The password field is required'))
                    .oneOf([Yup.ref('newPassword')], 'Passwords must match!')
                })}
                onSubmit={async (
                  _values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    await apiInstance.changePassword({
                      apiKey: router.query.apiKey,
                      oobCode: router.query.oobCode,
                      newPassword: _values.newPassword
                    });

                    handleOpenDialog();
                    if (isMountedRef()) {
                      setStatus({ success: true });
                      setSubmitting(false);
                    }
                  } catch (err) {
                    console.error(err.message);
                    if (isMountedRef()) {
                      setStatus({ success: false });
                      setErrors({
                        submit: 'An error has occured. Please try again later!'
                      });
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
                      error={Boolean(touched.newPassword && errors.newPassword)}
                      fullWidth
                      helperText={touched.newPassword && errors.newPassword}
                      label={t('New Password')}
                      margin="normal"
                      name="newPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.newPassword}
                      variant="outlined"
                    />
                    <TextField
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                      fullWidth
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                      label={t('Confirm password')}
                      margin="normal"
                      name="confirmPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.confirmPassword}
                      variant="outlined"
                    />
                    {errors && (
                      <Typography textAlign={'center'} color="red">
                        {errors.submit}
                      </Typography>
                    )}
                    <Button
                      sx={{
                        mt: 3
                      }}
                      color="primary"
                      disabled={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                      type="submit"
                      fullWidth
                      size="large"
                      variant="contained"
                    >
                      {t('Save new password')}
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
              {t('Your password has been reset successfully!')}
            </Alert>
          </Collapse>

          <Button
            fullWidth
            component={Link}
            variant="contained"
            onClick={handleCloseDialog}
            href={`/login`}
          >
            {t('Back to login')}
          </Button>
        </Box>
      </DialogWrapper>
    </>
  );
}

NewPassword.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default NewPassword;
