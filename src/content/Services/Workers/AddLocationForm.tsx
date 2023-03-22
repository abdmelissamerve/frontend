import { MouseEventHandler, useState } from 'react';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Card,
  TextField,
  CircularProgress,
  Button,
  Typography,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Autocomplete
} from '@mui/material';
import * as Yup from 'yup';

interface LocationProps {
  initialValues: object;
  addNewLocation(
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ): void | Promise<any>;
  handleCancelLocation(event: MouseEventHandler<HTMLButtonElement>): void;
}

const continents = [
  { value: 'North America', label: 'North America' },
  { value: 'South America', label: 'South America' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Oceania', label: 'Oceania' },
  { value: 'Antarctica', label: 'Antarctica' }
];

const defaultProps = {
  initialValues: {
    continent: '',
    country: '',
    city: '',
    state: '',
    countryCode: '',
    dataCenter: '',
    submit: null
  },
  addNewLocation: () => {},
  handleCancelLocation: () => {}
};

const AddLocationForm = (props: LocationProps = defaultProps) => {
  const { addNewLocation, handleCancelLocation, initialValues } = props;
  const { t }: { t: any } = useTranslation();
  const validationSchema = Yup.object().shape({
    continent: Yup.string()
      .max(255)
      .required(t('The continent field is required')),
    country: Yup.string().max(255).required(t('The country field is required')),
    countryCode: Yup.string()
      .min(2)
      .max(2)
      .required(t('The country field is required')),
    city: Yup.string().max(255).required(t('The city field is required')),
    dataCenter: Yup.string()
      .max(255)
      .required(t('The data center field is required')),
    state: Yup.string()
      .ensure()
      .when('continent', {
        is: (value: any) => ['North America', 'South America'].includes(value),
        then: Yup.string().required(t('The state field is required.'))
      })
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={addNewLocation}
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
          <Grid item xs={12} display="flex" container spacing={3}>
            <Grid item xs={12}>
              <Typography
                data-cy="title"
                variant="h4"
                sx={{ px: 1, pt: 1, mt: 2 }}
              >
                Add new location
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                disableClearable
                options={continents}
                getOptionLabel={(option) => option.label}
                onChange={(e, option) => {
                  setFieldValue('continent', option.value);
                }}
                renderInput={(params) => (
                  <TextField
                    data-cy="continent-field"
                    {...params}
                    error={Boolean(touched.continent && errors.continent)}
                    helperText={touched.continent && errors.continent}
                    fullWidth
                    variant="outlined"
                    label={t('Continent')}
                    placeholder={t('Select Continent')}
                  />
                )}
              />
              {/* <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Continent</InputLabel>
                <Select
                  value={values.continent}
                  onChange={(e) => {
                    setFieldValue('continent', e.target.value);
                  }}
                  label="Continent"
                >
                  <MenuItem value={'North America'}>North America</MenuItem>
                  <MenuItem value={'South America'}>South America</MenuItem>
                  <MenuItem value={'Europe'}>Europe</MenuItem>
                  <MenuItem value={'Asia'}>Asia</MenuItem>
                  <MenuItem value={'Africa'}>Africa</MenuItem>
                  <MenuItem value={'Oceania'}>Australia</MenuItem>
                  <MenuItem value={'Antarctica'}>Antarctica</MenuItem>
                </Select>
              </FormControl> */}
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                error={Boolean(touched.country && errors.country)}
                helperText={touched.country && errors.country}
                fullWidth
                label={t('Country')}
                name="country"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.country}
                variant="outlined"
                data-cy="country-field"
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <TextField
                error={Boolean(touched.countryCode && errors.countryCode)}
                helperText={touched.countryCode && errors.countryCode}
                fullWidth
                label={t('Country Code')}
                name="countryCode"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.countryCode}
                variant="outlined"
                data-cy="country-code-field"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={Boolean(touched.city && errors.city)}
                helperText={touched.city && errors.city}
                fullWidth
                label={t('City')}
                name="city"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.city}
                variant="outlined"
                data-cy="city-field"
              />
            </Grid>
            {['North America'].includes(values.continent) && (
              <Grid item xs={12} md={6}>
                <TextField
                  error={Boolean(touched.state && errors.state)}
                  helperText={touched.state && errors.state}
                  fullWidth
                  label={t('State')}
                  name="state"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.state}
                  variant="outlined"
                  data-cy="state-field"
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                error={Boolean(touched.dataCenter && errors.dataCenter)}
                helperText={touched.dataCenter && errors.dataCenter}
                fullWidth
                label={t('Data center')}
                name="dataCenter"
                onBlur={handleBlur}
                value={values.dataCenter}
                onChange={handleChange}
                variant="outlined"
                data-cy="data-center-field"
              />
            </Grid>
            {Boolean(errors.submit) && (
              <Grid item xs={12}>
                <Typography textAlign="right" color="red">
                  {errors.submit}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button
                sx={{
                  mx: 1
                }}
                color="secondary"
                onClick={(event) => handleCancelLocation(event)}
                data-cy="cancel-button"
              >
                {t('Cancel')}
              </Button>
              <Button
                type="submit"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={Boolean(errors.submit) || isSubmitting}
                variant="contained"
                data-cy="add-button"
              >
                {t('Add new location')}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AddLocationForm;
