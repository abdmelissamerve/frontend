import { MouseEventHandler } from 'react';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  DialogContent,
  TextField,
  CircularProgress,
  Button,
  useTheme,
  DialogActions,
  Typography,
  Autocomplete,
  MenuItem
} from '@mui/material';
import * as Yup from 'yup';
import 'react-quill/dist/quill.snow.css';

interface FormProps {
  editUser(
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ): void | Promise<any>;

  handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;

  initialData?: object;
}

const defaultProps = {
  editUser: () => {},
  handleCancel: () => {},
  errorMessage: '',
  initialData: {}
};

const superUserOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Technician', value: 'technician' },
  { label: 'User', value: 'user' }
];

const activeOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
];

const AddUserForm = (props: FormProps = defaultProps) => {
  const { editUser, handleCancel, initialData } = props;
  const { t }: { t: any } = useTranslation();
  const initialValues = {
    ...initialData
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .max(255)
      .required(t('The first name field is required')),
    last_name: Yup.string()
      .max(255)
      .required(t('The last name field is required'))
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={editUser}
      validationSchema={validationSchema}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <DialogContent
            dividers
            sx={{
              p: 3
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  error={Boolean(touched.first_name && errors.first_name)}
                  fullWidth
                  helperText={touched.first_name && errors.first_name}
                  label={t('First name')}
                  name="first_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.first_name}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={Boolean(touched.last_name && errors.last_name)}
                  fullWidth
                  helperText={touched.last_name && errors.last_name}
                  label={t('Last name')}
                  name="last_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.last_name}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  options={activeOptions}
                  getOptionLabel={(option) => option.label || ''}
                  defaultValue={values.is_active}
                  onChange={(event, value) => {
                    setFieldValue('is_active', value);
                  }}
                  renderInput={(params) => (
                    <TextField fullWidth {...params} label={t('Active')} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  options={superUserOptions}
                  getOptionLabel={(option) => option.label || ''}
                  defaultValue={values.role}
                  onChange={(event, value) => {
                    setFieldValue('role', value);
                  }}
                  renderInput={(params) => (
                    <TextField fullWidth {...params} label={t('Role')} />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              p: 3
            }}
          >
            <Button color="secondary" onClick={(event) => handleCancel(event)}>
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
              disabled={Boolean(errors.submit) || isSubmitting}
              variant="contained"
            >
              {t('Update user')}
            </Button>
          </DialogActions>
        </form>
      )}
    </Formik>
  );
};

export default AddUserForm;
