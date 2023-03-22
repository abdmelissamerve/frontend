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
  MenuItem
} from '@mui/material';
import * as Yup from 'yup';
import 'react-quill/dist/quill.snow.css';

interface FormProps {
  addBlocklistOrg(
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ): void | Promise<any>;

  handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;
  initialData?: object;
}

const defaultProps = {
  addBlocklistOrg: () => {},
  handleCancel: () => {},
  initialData: {}
};

const AddBlocklistOrgForm = (props: FormProps = defaultProps) => {
  const { addBlocklistOrg, handleCancel, initialData } = props;
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const initialValues = {
    name: '',
    domain: '',
    submit: null,
    ...initialData
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required(t('The first name field is required')),
    domain: Yup.string()
      .test('check-url', 'Input a valid url', function isValidHttpUrl(string) {
        let url;

        try {
          url = new URL(string);
        } catch (_) {
          return false;
        }

        return url.protocol === 'http:' || url.protocol === 'https:';
      })
      .required(t('The domain field is required'))
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={addBlocklistOrg}
      validationSchema={validationSchema}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
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
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label={t('Name')}
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={Boolean(touched.domain && errors.domain)}
                  fullWidth
                  helperText={touched.domain && errors.domain}
                  label={t('Domain')}
                  name="domain"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.domain}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography align="center" color="error" variant="h4">
                  {errors.submit}
                </Typography>
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
            {initialData ? (
              <Button
                type="submit"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={Boolean(errors.submit) || isSubmitting}
                variant="contained"
              >
                {t('Edit new blocklist organisation')}
              </Button>
            ) : (
              <Button
                type="submit"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={Boolean(errors.submit) || isSubmitting}
                variant="contained"
              >
                {t('Add blocklist organisation')}
              </Button>
            )}
          </DialogActions>
        </form>
      )}
    </Formik>
  );
};

export default AddBlocklistOrgForm;
