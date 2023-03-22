import { MouseEventHandler, useEffect, useState } from 'react';
import { Formik, FormikHelpers, FormikValues, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  DialogContent,
  TextField,
  CircularProgress,
  Button,
  useTheme,
  DialogActions,
  Autocomplete,
  Typography,
  Zoom
} from '@mui/material';
import * as Yup from 'yup';
import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/router';
import { sendInvitation } from '@/services/organisations';
import { useSnackbar } from 'notistack';
interface FormProps {
  inviteMember(values: FormikValues): void | Promise<any>;
  handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;
}

const defaultProps = {
  inviteMember: () => {},
  handleCancel: () => {}
};

const InviteMemberForm = (props: FormProps = defaultProps) => {
  const [responseError, setResponseError] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const { handleCancel, inviteMember } = props;
  const router = useRouter();
  const { t }: { t: any } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      formik.setSubmitting(true);
      await inviteMember(formik.values);
      formik.resetForm();
      formik.setStatus({ success: true });
      setResponseError('');
      handleCancel(event);
      formik.setSubmitting(false);
      enqueueSnackbar(t('The invitation has been sent successfully.'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom,
        autoHideDuration: 2000
      });
    } catch (err) {
      formik.setSubmitting(false);
      setResponseError('User already exists in this organisation.');
      console.error(err);
      formik.setStatus({ success: false });
      formik.setErrors({ submit: err.message });
    }
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().max(255).required(t('The email field is required')),
    role: Yup.string().max(255).required(t('The role field is required'))
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      role: 'member',
      submit: null
    },
    onSubmit: handleSubmit,
    validationSchema: validationSchema
  });

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent
        dividers
        sx={{
          p: 3
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <TextField
              data-cy="email-field"
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label={t('Email')}
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              disableClearable
              disablePortal
              options={['member', 'owner']}
              getOptionLabel={(option) => option}
              defaultValue={'member'}
              renderInput={(params) => (
                <TextField
                  name="role"
                  error={Boolean(formik.touched.role && formik.errors.role)}
                  helperText={formik.touched.role && formik.errors.role}
                  fullWidth
                  {...params}
                  label={t('Role')}
                  data-cy="role-field"
                />
              )}
            />
          </Grid>
        </Grid>
        {responseError != '' && (
          <Typography align="center" color="error" variant="h5" sx={{ mt: 2 }}>
            {responseError}
          </Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3
        }}
      >
        <Button
          color="secondary"
          data-cy="cancel-button"
          onClick={(event) => handleCancel(event)}
        >
          {t('Cancel')}
        </Button>

        <Button
          type="submit"
          startIcon={
            formik.isSubmitting ? <CircularProgress size="1rem" /> : null
          }
          disabled={!(formik.isValid && formik.dirty)}
          variant="contained"
          data-cy="add-button"
        >
          {t('Invite member')}
        </Button>
      </DialogActions>
    </form>
  );
};

export default InviteMemberForm;
