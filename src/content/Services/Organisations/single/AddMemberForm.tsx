import { MouseEventHandler, useEffect } from 'react';
import { FormikValues, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  DialogContent,
  TextField,
  CircularProgress,
  Button,
  useTheme,
  DialogActions,
  Typography
} from '@mui/material';
import * as Yup from 'yup';

interface FormProps {
  addMember(values: FormikValues): void | Promise<any>;

  handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;
  initialData?: object;
}

const defaultProps = {
  addMember: () => {},
  handleCancel: () => {},
  initialData: {}
};

const AddMemberForm = (props: FormProps = defaultProps) => {
  const { addMember, handleCancel, initialData } = props;
  const { t }: { t: any } = useTranslation();
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      addMember({
        role: formik.values.role,
        email: formik.values.email
      });
      formik.resetForm();
      formik.setStatus({ success: true });
      formik.setSubmitting(false);
    } catch (err) {
      console.error(err);
      formik.setStatus({ success: false });
      formik.setErrors({ submit: err.message });
    }
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email(),
    role: Yup.string().max(256).required(t('The role field is required'))
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      role: '',
      submit: null,
      ...initialData
    },
    onSubmit: handleSubmit,
    validationSchema: validationSchema
  });
  const theme = useTheme();
  const initialValues = {
    email: '',
    role: '',
    submit: null,
    ...initialData
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent
        dividers
        sx={{
          p: 3
        }}
      >
        <Grid container spacing={3}>
          {!initialData && (
            <Grid item xs={12} md={12}>
              <TextField
                data-cy="email-field"
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label={t('User email')}
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                variant="outlined"
              />
            </Grid>
          )}
          <Grid item xs={12} md={12}>
            <TextField
              data-cy="role-field"
              error={Boolean(formik.touched.role && formik.errors.role)}
              fullWidth
              helperText={formik.touched.role && formik.errors.role}
              label={t('User role')}
              name="role"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.role}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" color="error" variant="h4">
              {formik.errors.submit}
            </Typography>
          </Grid>
        </Grid>
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
        {initialData ? (
          <Button
            type="submit"
            startIcon={
              formik.isSubmitting ? <CircularProgress size="1rem" /> : null
            }
            disabled={!(formik.isValid && formik.dirty)}
            variant="contained"
            data-cy="edit-button-form"
          >
            {t('Edit this member')}
          </Button>
        ) : (
          <Button
            type="submit"
            startIcon={
              formik.isSubmitting ? <CircularProgress size="1rem" /> : null
            }
            disabled={!(formik.isValid && formik.dirty)}
            variant="contained"
            data-cy="add-button"
          >
            {t('Add member')}
          </Button>
        )}
      </DialogActions>
    </form>
  );
};

export default AddMemberForm;
