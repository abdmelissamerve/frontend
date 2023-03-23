import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { FC } from 'react';
import Link from 'src/components/Link';

import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  FormHelperText,
  Typography,
  CircularProgress,
  Grid
} from '@mui/material';
import { useAuth } from 'src/hooks/useAuth';
import { useRefMounted } from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import { apiInstance } from '@/api-config/api';


export const RegisterFirebaseAuth: FC = (props) => {
  const { createUserWithEmailAndPassword } = useAuth() as any;
  const isMountedRef = useRefMounted();
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      terms: true,
      submit: null
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(255)
        .required(t('The first name field is required')),
      lastName: Yup.string()
        .max(255)
        .required(t('The last name field is required')),
      email: Yup.string()
        .email(t('The email address provided should be valid'))
        .max(255)
        .required(t('The email field is required')),
      password: Yup.string()
        .min(8)
        .max(255)
        .required(t('The password field is required')),
      phoneNumber: Yup.string()
        .min(10)
        .max(10)
        .required(t('The phone number field is required')),
      terms: Yup.boolean().oneOf(
        [true],
        t('You must agree to our terms and conditions')
      )
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber
      };
      try {
          const user = await apiInstance.registerUser(data);
          if (isMountedRef() && user) {
            const backTo = (router.query.backTo as string) || '/';
            router.push(backTo);
          }
      } catch (err) {
        console.error(err);

        if (isMountedRef()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    }
  });

  return (
    <Box {...props}>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              error={Boolean(
                formik.touched.firstName && formik.errors.firstName
              )}
              fullWidth
              helperText={formik.touched.firstName && formik.errors.firstName}
              label={t('First Name')}
              placeholder={t('Your first name here...')}
              margin="normal"
              name="firstName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.firstName}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={Boolean(formik.touched.lastName && formik.errors.lastName)}
              fullWidth
              helperText={formik.touched.lastName && formik.errors.lastName}
              label={t('Last Name')}
              placeholder={t('Your last name here...')}
              margin="normal"
              name="lastName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.lastName}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} style={{ paddingTop: 0 }}>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label={t('Email')}
              placeholder={t('Your email here...')}
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} lg={12} style={{ paddingTop: 0 }}>
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label={t('Password')}
              placeholder={t('Your password here...')}
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} lg={12} style={{ paddingTop: 0 }}>
            <TextField
              error={Boolean(formik.touched.phoneNumber && formik.errors.phoneNumber)}
              fullWidth
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              label={t('Phone Number')}
              placeholder={t('Your phone number here...')}
              margin="normal"
              name="phoneNumber"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.phoneNumber}
              variant="outlined"
            />
          </Grid>
        </Grid>
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
            <Typography variant="body2">
              {t('I accept the')}{' '}
              <Link href="https://pinglatency.com/terms-and-conditions">
                {t('terms and conditions')}
              </Link>
              .
            </Typography>
          }
        />
        <Button
          sx={{
            mt: 3
          }}
          color="primary"
          startIcon={
            formik.isSubmitting ? <CircularProgress size="1rem" /> : null
          }
          disabled={formik.isSubmitting}
          size="large"
          fullWidth
          type="submit"
          variant="contained"
        >
          {t('Create account')}
        </Button>
        {Boolean(formik.touched.submit && formik.errors.submit) && (
          <FormHelperText sx={{ textAlign: 'center' }} error>
            {formik.errors.submit}
          </FormHelperText>
        )}
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href={'/login'} variant={'body1'}>
            Sign in here
          </Link>
        </Typography>
      </form>
    </Box>
  );
};