import { MouseEventHandler, useState, useEffect } from 'react';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  styled,
  Grid,
  FormHelperText,
  DialogContent,
  Card,
  TextField,
  CircularProgress,
  Autocomplete,
  Button,
  useTheme,
  Typography,
  DialogActions
} from '@mui/material';
import * as Yup from 'yup';
import DatePicker from '@mui/lab/DatePicker';
import { getProviderLocations } from '@/services/providerLocation';
import { isValid4, isValid6 } from '@/utils/validateIp';

interface EditFormProps {
  handleFormSubmit(
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ): void | Promise<any>;
  handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;
  providers: Array<any>;
  initialData?: object;
}

const defaultProps = {
  handleFormSubmit: () => {},
  handleCancel: () => {},
  providers: [],
  initialData: {}
};

const currency = [
  { label: 'RON', value: 'ron' },
  { label: 'EUR', value: 'eur' },
  { label: 'USD', value: 'usd' },
  { label: 'GBP', value: 'gbp' }
];
const recurrency = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Every 3 months', value: 'every 3 months' },
  { label: 'Every 6 months', value: 'every 6 months' },
  { label: 'Yearly', value: 'yearly' }
];

Yup.addMethod(
  Yup.string,
  'isValidIp4',
  function (errorMessage = 'IP is not valid') {
    return this.test('ip', errorMessage, function (value) {
      const { path, createError } = this;
      const isValid = isValid4(value);
      return isValid || createError({ path, message: errorMessage });
    });
  }
);

Yup.addMethod(
  Yup.string,
  'isValidIp6',
  function (errorMessage = 'IP is not valid') {
    return this.test('ip', errorMessage, function (value) {
      const { path, createError } = this;
      if (!value) return true;
      const isValid = isValid6(value);
      return isValid || createError({ path, message: errorMessage });
    });
  }
);

const EditworkerForm = (props: EditFormProps = defaultProps) => {
  const { handleFormSubmit, handleCancel, providers, initialData } = props;
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const [openProvLocation, setOpenProvLocation] = useState(false);
  const [providerLocation, setProviderLocation] = useState([]);
  const [openNewLocation, setOpenNewLocation] = useState(false);
  const initialValues = {
    password: '',
    ipv4: '',
    ipv6: '',
    price: '',
    port: '',
    currency: '',
    payment_recurrence: '',
    payment_date: '',
    provider: '',
    provider_location: '',
    submit: null,
    ...initialData
  };

  const validationSchema = Yup.object().shape({
    ipv4: Yup.string().min(1, 'Too Short!').isValidIp4().required(),
    ipv6: Yup.string().min(1, 'Too Short!').isValidIp6().nullable(),
    port: Yup.number().required(t('The port field is required')),
    price: Yup.number()
      .typeError('You must specify a number')
      .max(255)
      .required(t('The price field is required')),
    currency: Yup.object().required(t('This field is required')).nullable(),
    payment_recurrence: Yup.object()
      .required(t('This field is required'))
      .nullable(),
    provider: Yup.object().required(t('This field is required')).nullable(),
    provider_location: Yup.object()
      .required(t('This field is required'))
      .nullable()
  });

  const getProviderLocation = async (provider) => {
    try {
      const providerLocations = await getProviderLocations(provider.id);
      setOpenProvLocation(true);
      setProviderLocation(providerLocations);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLocation = () => {
    setOpenNewLocation(true);
  };

  const saveNewLocation = () => {};

  useEffect(() => {
    console.log(initialValues);
  }, [initialValues]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      validationSchema={validationSchema}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
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
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={10}>
                    <TextField
                      error={Boolean(touched.ipv4 && errors.ipv4)}
                      fullWidth
                      helperText={touched.ipv4 && errors.ipv4}
                      label={t('IPv4 Address')}
                      name="ipv4"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.ipv4}
                      variant="outlined"
                      data-cy="ipv4-field"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      error={Boolean(touched.port && errors.port)}
                      fullWidth
                      helperText={touched.port && errors.port}
                      label={t('Port')}
                      name="port"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.port}
                      variant="outlined"
                      data-cy="port-field"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.ipv6 && errors.ipv6)}
                      fullWidth
                      helperText={touched.ipv6 && errors.ipv6}
                      label={t('IPv6 Address')}
                      name="ipv6"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.ipv6}
                      variant="outlined"
                      data-cy="ipv6-field"
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      helperText={touched.password && errors.password}
                      label={t('Password')}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      data-cy="password-field"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      error={Boolean(touched.price && errors.price)}
                      fullWidth
                      helperText={touched.price && errors.price}
                      label={t('Price')}
                      name="price"
                      onBlur={handleBlur}
                      value={values.price}
                      onChange={handleChange}
                      variant="outlined"
                      data-cy="price-field"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      disablePortal
                      options={currency}
                      getOptionLabel={(option) => option.label}
                      defaultValue={values.currency}
                      name="currency"
                      onChange={(event, value) => {
                        setFieldValue('currency', value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          name="currency"
                          error={Boolean(touched.currency && errors.currency)}
                          helperText={touched.currency && errors.currency}
                          fullWidth
                          {...params}
                          label={t('Currency')}
                          data-cy="currency-field"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      disablePortal
                      options={recurrency}
                      getOptionLabel={(option) => option.label}
                      defaultValue={values.payment_recurrence}
                      name="payment_recurrence"
                      onChange={(event, value) => {
                        setFieldValue('payment_recurrence', value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{
                            mt: 2
                          }}
                          name="payment_recurrence"
                          error={Boolean(
                            touched.payment_recurrence &&
                              errors.payment_recurrence
                          )}
                          helperText={
                            touched.payment_recurrence &&
                            errors.payment_recurrence
                          }
                          fullWidth
                          {...params}
                          label={t('Payment Recurrency')}
                          data-cy="payment-recurrency-field"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      value={values.payment_date}
                      onChange={(date) => setFieldValue('payment_date', date)}
                      label={t('Payment Date')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="normal"
                          variant="outlined"
                          fullWidth
                          name="start"
                          data-cy="payment-date-field"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      disablePortal
                      options={providers}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, value) => {
                        getProviderLocation(value);
                        setFieldValue('provider', value);
                      }}
                      defaultValue={values.provider}
                      renderInput={(params) => (
                        <TextField
                          name="provider"
                          error={Boolean(touched.provider && errors.provider)}
                          helperText={touched.provider && errors.provider}
                          fullWidth
                          {...params}
                          label={t('Provider')}
                          data-cy="provider-field"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      disablePortal
                      options={providerLocation}
                      getOptionLabel={(option: any) =>
                        `[${option.continent}] ${option.country} - ${option.city}`
                      }
                      onChange={(event, value) => {
                        setFieldValue('provider_location', value);
                      }}
                      defaultValue={values.provider_location}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          name="provider_location"
                          error={Boolean(
                            touched.provider_location &&
                              errors.provider_location
                          )}
                          helperText={
                            touched.provider_location &&
                            errors.provider_location
                          }
                          {...params}
                          label={t('Provider Location')}
                          data-cy="provider-location-field"
                        />
                      )}
                    />
                  </Grid>
                  {/* <Grid item xs={2}>
                    <Button onClick={handleAddLocation}>Add location</Button>
                  </Grid> */}

                  {openNewLocation && (
                    <Card sx={{ ml: 3, mt: 4 }}>
                      <Grid
                        item
                        xs={12}
                        display="flex"
                        container
                        spacing={3}
                        sx={{ p: 2 }}
                      >
                        <Grid item xs={12}>
                          <Typography variant="h4" sx={{ px: 1, pt: 1 }}>
                            Add new location
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label={t('Continent')}
                            name="continet"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label={t('Country')}
                            name="country"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label={t('City')}
                            name="city"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label={t('Data center')}
                            name="dataCenter"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button onClick={saveNewLocation}>
                            Save location
                          </Button>
                        </Grid>
                      </Grid>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              p: 3
            }}
          >
            <Button
              data-cy="cancel-button"
              color="secondary"
              onClick={(event) => handleCancel(event)}
            >
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
              disabled={Boolean(errors.submit) || isSubmitting}
              variant="contained"
              data-cy="submit-button"
            >
              {t('Save changes')}
            </Button>
          </DialogActions>
        </form>
      )}
    </Formik>
  );
};

export default EditworkerForm;
