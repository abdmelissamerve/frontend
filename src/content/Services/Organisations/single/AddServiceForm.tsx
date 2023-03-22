import { MouseEventHandler } from 'react';
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
  addService(values: FormikValues): void | Promise<any>;

  handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;
  initialData?: object;
}

const defaultProps = {
  addService: () => {},
  handleCancel: () => {},
  initialData: {}
};

const AddServiceForm = (props: FormProps = defaultProps) => {
  const { addService, handleCancel, initialData } = props;
  const { t }: { t: any } = useTranslation();
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      addService({
        name: formik.values.name,
        type: formik.values.type
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
    name: Yup.string().max(255).required(t('The name field is required')),
    type: Yup.string().max(255).required(t('The type field is required'))
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      submit: null,
      ...initialData
    },
    onSubmit: handleSubmit,
    validationSchema: validationSchema
  });
  const theme = useTheme();
  const initialValues = {
    name: '',
    type: '',
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
          <Grid item xs={12} md={12}>
            <TextField
              data-cy="name-field"
              error={Boolean(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label={t('Name')}
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              data-cy="type-field"
              error={Boolean(formik.touched.type && formik.errors.type)}
              fullWidth
              helperText={formik.touched.type && formik.errors.type}
              label={t('Type')}
              name="type"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.type}
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
            {t('Edit this service')}
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
            {t('Add service')}
          </Button>
        )}
      </DialogActions>
    </form>
  );
};

export default AddServiceForm;
