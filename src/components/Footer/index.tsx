import { useCallback } from 'react';
import * as Yup from 'yup';
import {
  Box,
  Card,
  Typography,
  styled,
  Link,
  useTheme,
  Paper
} from '@mui/material';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { apiInstance } from 'src/config/api';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useSnackbar } from 'notistack';
import Logo from '@/components/LogoSign';

const FooterWrapper = styled(Card)(
  ({ theme }) => `
        border-radius: 0;
        margin-top: ${theme.spacing(2)};
`
);

function Footer() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const subjects = [
    'Say hello',
    'Report a bug',
    'Propose a feature',
    'Ask a question'
  ];

  const handleSubmit = async (_values) => {
    const recaptchaToken = await handleReCaptchaVerify();
    const data = {
      subject: _values.subject,
      sender_email: _values.email,
      sender_name: _values.name,
      message: _values.message,
      recaptcha: recaptchaToken
    };
    try {
      await apiInstance.sendEmail(data);
      enqueueSnackbar(
        'Thank your for contacting us! We will get back to you soon.',
        {
          variant: 'info',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          },
          autoHideDuration: 2000
        }
      );
    } catch (err) {
      enqueueSnackbar('Oops! An error occurred, please try again later.', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        },
        autoHideDuration: 2000
      });
    }
    formik.resetForm();
  };
  const formik = useFormik({
    initialValues: {
      subject: null,
      name: '',
      email: '',
      message: ''
    },
    validationSchema: Yup.object().shape({
      subject: Yup.string()
        .oneOf(subjects)
        .required('Subject field is required')
        .nullable(),
      name: Yup.string()
        .min(3, 'Name too short.')
        .required('Name field is required'),
      email: Yup.string()
        .email('Invalid email address.')
        .required('Email field is required'),
      message: Yup.string()
        .min(20, 'Please tell us more...')
        .required('Message field is required')
    }),
    onSubmit: handleSubmit
  });

  // google recaptcha
  const { executeRecaptcha } = useGoogleReCaptcha();
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    const token = await executeRecaptcha('run_ping');
    return token;
  }, [executeRecaptcha]);

  return (
    <Paper sx={{ marginTop: 2 }}>
      <Box
        padding={1}
        display={'flex'}
        alignItems={'center'}
        justifyContent="center"
        textAlign={{ xs: 'center', md: 'left' }}
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >

        <Box>
          <Typography
            sx={{
              pt: { xs: 2, md: 0 }
            }}
            variant="subtitle1"
          >
            <Link href="/" rel="noopener noreferrer">
             CSML Final
            </Link>{' '}
            &copy; 2023
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default Footer;
