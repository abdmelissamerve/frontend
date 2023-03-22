import { MouseEventHandler, useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { io, Socket } from 'socket.io-client';
import {
  Grid,
  DialogContent,
  Collapse,
  TextField,
  CircularProgress,
  Autocomplete,
  Button,
  Typography,
  DialogActions,
  Zoom,
  InputAdornment,
  IconButton
} from '@mui/material';
import * as Yup from 'yup';
import DatePicker from '@mui/lab/DatePicker';
import {
  getProviderLocations,
  addProviderLocation
} from '@/services/providerLocation';
import { getIpLocationData } from '@/services/thirdparty';
import { getWorkers } from '@/services/workers';
import dynamic from 'next/dynamic';
import { createTerm } from '@/hooks/useTerminal';
import { useSnackbar } from 'notistack';
import { isValid4, isValid6 } from '@/utils/validateIp';
import Visibility from '@mui/icons-material/Visibility';
import firebase from '@/utils/firebase';

const AddLocationForm = dynamic(
  () => import('../../Services/Workers/AddLocationForm'),
  {
    ssr: false
  }
);

interface EditFormProps {
  onClose(event: MouseEventHandler<HTMLButtonElement>): void;
  providers: Array<any>;
  initialData?: object;
}

const defaultProps = {
  onClose: () => {},
  providers: [],
  initialData: {}
};

const currency = [
  { label: 'RON', value: 'ron' },
  { label: 'EUR', value: 'eur' },
  { label: 'USD', value: 'usd' },
  { label: 'GBP', value: 'gbp' }
];
const recurrence = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Every 3 months', value: 'every 3 months' },
  { label: 'Every 6 months', value: 'every 6 months' },
  { label: 'Yearly', value: 'yearly' }
];

const InstallWorker = (props: EditFormProps = defaultProps) => {
  const { onClose, providers, initialData } = props;
  const { t }: { t: any } = useTranslation();
  const [openProvLocation, setOpenProvLocation] = useState(false);
  const [providerLocations, setProviderLocations] = useState(null);
  const [providerData, setProviderData] = useState(null);
  const [openNewLocation, setOpenNewLocation] = useState(false);

  const [isRunningInstall, setIsRunningInstall] = useState(false);
  const [isSavingWorker, setIsSavingWorker] = useState(false);
  const [installStep, setInstallStep] = useState(1);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('pending');
  const [connectionError, setConnectionError] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);

  const [addLocationInitialData, setAddLocationInitialData] = useState({
    continent: '',
    country: '',
    countryCode: '',
    city: '',
    dataCenter: ''
  });

  const terminalRef = useRef(null);
  const termRef = useRef(null);
  const socketRef = useRef<Socket | null>(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({});

  const persistentSnackbarAction = (snackbarId) => (
    <>
      <button
        style={{
          backgroundColor: 'transparent',
          border: 0,
          color: 'white',
          cursor: 'pointer'
        }}
        onClick={() => {
          closeSnackbar(snackbarId);
        }}
      >
        Dismiss
      </button>
    </>
  );

  useEffect(() => {
    if (installStep !== 2) return;
    if (!terminalRef.current) return;
    if (Object.keys(formData).length === 0) return;

    (async () => {
      const currentUser = firebase.auth().currentUser;
      let token = '';
      if (currentUser) {
        token = await currentUser.getIdToken();
      }
      const term = createTerm(terminalRef);

      const ms = io(
        `${process.env.NEXT_PUBLIC_APP_WS_ENDPOINT}/finish_install_worker`,
        {
          path: '/ws/socket.io/',
          forceNew: true,
          transports: ['websocket'],
          reconnectionAttempts: 3,
          auth: { token }
        }
      );

      ms.on('data', (response) => {
        term.write(response);
      });

      ms.on('connect', () => {
        setConnectionStatus('connected');
        setConnectionError(null);
        enqueueSnackbar('Socket connected', {
          variant: 'info',
          persist: true,
          action: persistentSnackbarAction,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      });

      ms.on('disconnect', () => {
        setIsSavingWorker(false);
        setIsRunningInstall(false);
        enqueueSnackbar('Socket disconnected', {
          variant: 'warning',
          persist: true,
          action: persistentSnackbarAction,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      });

      ms.on('connect_error', (error) => {
        setIsSavingWorker(false);
        setConnectionStatus('error');
        setConnectionError(error.message);
        enqueueSnackbar(error.message, {
          variant: 'error',
          persist: true,
          action: persistentSnackbarAction,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      });

      ms.on('worker_connect_error', (data) => {
        setIsRunningInstall(false);
        setInstallStep(1);
        enqueueSnackbar(`SSH Error: ${data.error}`, {
          variant: 'error',
          persist: true,
          action: persistentSnackbarAction,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      });

      ms.on('install_success', () => {
        setInstallSuccess(true);
      });

      ms.on('save_success', () => {
        onClose();
        enqueueSnackbar(t('The worker was created successfully'), {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      });

      ms.on('worker_exists_error', (data) => {
        setIsSavingWorker(false);
        enqueueSnackbar(data.error, {
          variant: 'error',
          persist: true,
          action: persistentSnackbarAction,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      });

      ms.on('save_error', (data) => {
        setIsSavingWorker(false);
        console.error('Save Error: ', data);
        enqueueSnackbar(data.error, {
          variant: 'error',
          persist: true,
          action: persistentSnackbarAction,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      });

      ms.on('install_not_ready', () => {
        enqueueSnackbar(t('Install not ready. Please wait...'), {
          variant: 'warning',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      });

      ms.emit('run_install', {
        hostname: formData.hostname,
        username: formData.username,
        password: formData.password,
        provider: formData.provider,
        port: formData.port,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        country_code: formData.country_code,
        location_coordinates: formData.coordinates,
        location_address: formData.location_address,
        location_internet_provider: formData.provider.name,
        location_contact_person: formData.location_contact_person,
        location_contact_phone: formData.location_contact_phone
      });
      setIsRunningInstall(true);

      term.onData((data) => {
        ms.emit('data', data);
      });

      socketRef.current = ms;
      termRef.current = term;
    })();

    return () => {
      termRef.current?.dispose();
      socketRef.current?.disconnect();
    };
  }, [installStep, terminalRef, formData]);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(1)
      .max(255)
      .required(t('The username field is required')),
    password: Yup.string()
      .min(1)
      .max(255)
      .required(t('The password field is required')),
    ipv4: Yup.string()
      .min(1, 'Too Short!')
      .required()
      .test('ip exists', 'IP is invalid', (value) => {
        const isValid = isValid4(value);
        // const response = await getWorkers({
        //   search: value,
        //   disabled: '',
        //   ip_type: '',
        //   skip: 0,
        //   limit: 1000
        // });
        // if (response.workers.length !== 0) {
        //   return createError({ message: 'IP already exists' });
        // } else {
        return isValid ? true : false;
      }),
    ipv6: Yup.string()
      .min(1, 'Too Short!')
      .test('ip exists', 'IP is invalid', (value) => {
        if (value) {
          const isValid = isValid6(value);
          // const response = await getWorkers({
          //   search: value,
          //   disabled: '',
          //   ip_type: '',
          //   skip: 0,
          //   limit: 1000
          // });
          // if (response.workers.length !== 0) {
          //   return createError({ message: 'IP already exists' });
          // } else {
          return isValid ? true : false;
        }
        return true;
      }),
    port: Yup.number().required(t('The port field is required')),
    // price: Yup.number()
    //   .typeError('You must specify a number')
    //   .max(255)
    //   .required(t('The price field is required')),
    // currency: Yup.object().required(t('This field is required')),
    provider: Yup.object().required(t('This field is required')).nullable(),
    // orderDate: Yup.date().required(t('This field is required')),
    // paymentDate: Yup.date().required(t('This field is required')),
    providerLocation: Yup.object().required(t('This field is required')),
    // paymentRecurrence: Yup.object().required(t('This field is required')),
    location_address: Yup.string()
      .required(t('This field is required'))
      .min(2, 'Must have at least 2 characters'),
    location_contact_person: Yup.string()
      .min(2, 'Must have at least 2 characters')
      .max(20, 'Must be 20 characters or less')
      .required('Contact Person field is required'),
    location_contact_phone: Yup.string()
      .required('Conctact phone field is required')
      .max(10, 'Must be 10 characters')
      .min(10, 'Must be 10 characters')
  });

  const handleFormSubmit = async (_values, { setStatus, setSubmitting }) => {
    setFormData({
      hostname: _values.ipv4,
      // ipv6: _values.ipv6 ? _values.ipv6 : null,
      username: _values.username,
      password: _values.password,
      city: _values.providerLocation.city,
      state: _values.providerLocation.state
        ? _values.providerLocation.state
        : null,
      country: _values.providerLocation.country,
      country_code: _values.providerLocation.country_code,
      location_coordinates:
        _values.providerLocation.coordinates.latitude.toString() +
        ',' +
        _values.providerLocation.coordinates.longitude.toString(),
      port: _values.port,
      // price: parseFloat(_values.price),
      // currency: _values.currency.value,
      // order_date: _values.orderDate,
      // payment_date: _values.paymentDate,
      // payment_recurrence: _values.paymentRecurrence.value,
      provider: _values.provider.name,
      // provider_location: _values.providerLocation,
      provider_location_id: _values.providerLocation.id,
      location_contact_person: _values.location_contact_person,
      location_contact_phone: _values.location_contact_phone,
      location_address: _values.location_address,
      hardware_id: initialData?.id
    });

    setInstallStep(2);
    setStatus({ success: true });
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      username: 'root',
      password: '',
      ipv4: initialData?.worker?.private_ipv4 || '',
      ipv6: '',
      // price: '',
      // currency: null,
      // paymentRecurrence: null,
      // paymentDate: null,
      // orderDate: null,
      provider: null,
      providerLocation: null,
      location_contact_person: '',
      location_contact_phone: '',
      port: 22,
      location_address: '',
      submit: null
    },
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
    validationSchema: validationSchema
  });
  const { errors, values } = formik;

  const getProviderLocation = async (provider) => {
    try {
      const locations = await getProviderLocations(provider.id);
      setOpenProvLocation(true);
      setProviderData(provider);
      setProviderLocations(locations);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLocation = async () => {
    if (isValid4(formik.values.ipv4)) {
      const locationData = await getIpLocationData(formik.values.ipv4);
      setAddLocationInitialData(locationData);
    }
    setOpenNewLocation(true);
    const element = document.getElementById('box');
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
  };

  const handleCancelLocation = () => {
    setOpenNewLocation(false);
  };

  const addNewLocation = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const data = {
        continent: _values.continent,
        country: _values.country,
        country_code: _values.countryCode,
        city: _values.city,
        state: _values.state,
        data_center: _values.dataCenter
      };
      const location = await addProviderLocation(providerData.id, data);
      await getProviderLocation(providerData);
      formik.setFieldValue('providerLocation', location.data);
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
      setOpenNewLocation(false);
    } catch (err) {
      console.error('Cannot create location', err);
      setStatus({ success: false });
      setErrors({ submit: err.data.detail });
      setSubmitting(false);
    }
  };

  // handle add worker button in step 2 of the form
  const handleFinishInstall = () => {
    socketRef.current.emit('save', formData);
    setIsSavingWorker(true);
  };

  // handle install button in step 2 of the form
  const handleReinstall = () => {
    socketRef.current.emit('run_install', {
      hostname: formData.ipv4,
      username: formData.username,
      password: formData.password,
      port: formData.port,
      city: formData.provider_location.city,
      country: formData.provider_location.country,
      country_code: formData.provider_location.country_code,
      provider: formData.provider.name
    });
    setIsRunningInstall(true);
  };

  // handle cancel action in the step 2 of the form
  const handleCancel = () => {
    socketRef.current?.removeAllListeners();
    termRef.current?.dispose();
    socketRef.current?.disconnect();
    setIsRunningInstall(false);
    setIsSavingWorker(false);
    setInstallStep(1);
  };

  return (
    <>
      <Collapse in={installStep === 1} timeout="auto" unmountOnExit>
        <DialogContent
          dividers
          sx={{
            p: 3
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Typography data-cy="mandatory-field" sx={{ pl: 4, pt: 1 }}>
                Fields marked with * are mandatory
              </Typography>
              <Grid item xs={12} md={10}>
                <TextField
                  data-cy="ipv4-field"
                  error={Boolean(formik.touched.ipv4 && formik.errors.ipv4)}
                  fullWidth
                  helperText={formik.touched.ipv4 && formik.errors.ipv4}
                  label={t('IPv4 Address*')}
                  name="ipv4"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.ipv4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  data-cy="port-field"
                  error={Boolean(formik.touched.port && formik.errors.port)}
                  fullWidth
                  helperText={formik.touched.port && formik.errors.port}
                  label={t('Port*')}
                  name="port"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.port}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  data-cy="ipv6-field"
                  error={Boolean(formik.touched.ipv6 && formik.errors.ipv6)}
                  fullWidth
                  helperText={formik.touched.ipv6 && formik.errors.ipv6}
                  label={t('IPv6 Address')}
                  name="ipv6"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.ipv6}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  data-cy="username-field"
                  error={Boolean(
                    formik.touched.username && formik.errors.username
                  )}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label={t('Username*')}
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  data-cy="password-field"
                  error={Boolean(
                    formik.touched.password && formik.errors.password
                  )}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label={t('Password*')}
                  name="password"
                  type={passwordShown ? 'text' : 'password'}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          onMouseDown={() => {
                            setPasswordShown(true);
                          }}
                          onMouseUp={() => {
                            setPasswordShown(false);
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  data-cy="price-field"
                  error={Boolean(formik.touched.price && formik.errors.price)}
                  fullWidth
                  helperText={formik.touched.price && formik.errors.price}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '^[0-9]*.?[0-9]*$'
                  }}
                  label={t('Price*')}
                  name="price"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.price}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  options={currency}
                  getOptionLabel={(option) => option.label}
                  value={formik.values.currency}
                  onChange={(event, value) => {
                    formik.setFieldValue('currency', value);
                  }}
                  onBlur={formik.handleBlur}
                  name={'currency'}
                  renderInput={(params) => (
                    <TextField
                      data-cy="currency-field"
                      name={'currency'}
                      error={Boolean(
                        formik.touched.currency && formik.errors.currency
                      )}
                      helperText={
                        formik.touched.currency && formik.errors.currency
                      }
                      fullWidth
                      {...params}
                      label={t('Currency*')}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  disablePortal
                  options={recurrence}
                  value={formik.values.paymentRecurrence}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    formik.setFieldValue('paymentRecurrence', value);
                  }}
                  onBlur={formik.handleBlur}
                  name={'paymentRecurrence'}
                  renderInput={(params) => (
                    <TextField
                      data-cy="payment-recurrence-field"
                      name={'paymentRecurrence'}
                      error={Boolean(
                        formik.touched.paymentRecurrence &&
                          formik.errors.paymentRecurrence
                      )}
                      helperText={
                        formik.touched.paymentRecurrence &&
                        formik.errors.paymentRecurrence
                      }
                      fullWidth
                      {...params}
                      label={t('Payment Recurrence*')}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  inputFormat="dd/MM/yyyy"
                  value={formik.values.paymentDate}
                  onChange={(value) =>
                    formik.setFieldValue('paymentDate', value)
                  }
                  label={t('Payment Date*')}
                  renderInput={(params) => (
                    <TextField
                      data-cy="payment-date-field"
                      {...params}
                      variant="outlined"
                      fullWidth
                      name="start"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  inputFormat="dd/MM/yyyy"
                  value={formik.values.orderDate}
                  onChange={(value) => formik.setFieldValue('orderDate', value)}
                  label={t('Order Date*')}
                  renderInput={(params) => (
                    <TextField
                      data-cy="order-date-field"
                      {...params}
                      variant="outlined"
                      fullWidth
                      name="end"
                    />
                  )}
                />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <TextField
                  data-cy="location_contact_person"
                  error={Boolean(
                    formik.touched.location_contact_person &&
                      formik.errors.location_contact_person
                  )}
                  fullWidth
                  helperText={
                    formik.touched.location_contact_person &&
                    formik.errors.location_contact_person
                  }
                  label={'Contact Person'}
                  name="location_contact_person"
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    // const trimed = e.target.value.trim();
                    formik.setFieldValue(
                      'location_contact_person',
                      e.target.value
                    );
                  }}
                  value={formik.values.location_contact_person}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  data-cy="location_contact_phone"
                  error={Boolean(
                    formik.touched.location_contact_phone &&
                      formik.errors.location_contact_phone
                  )}
                  fullWidth
                  helperText={
                    formik.touched.location_contact_phone &&
                    formik.errors.location_contact_phone
                  }
                  label={'Contact Phone'}
                  name="location_contact_phone"
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    const trimed = e.target.value.trim();
                    formik.setFieldValue('location_contact_phone', trimed);
                  }}
                  value={formik.values.location_contact_phone}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  data-cy="location-address-field"
                  error={Boolean(
                    formik.touched.location_address &&
                      formik.errors.location_address
                  )}
                  fullWidth
                  helperText={
                    formik.touched.location_address &&
                    formik.errors.location_address
                  }
                  label={t('Location Address*')}
                  name="location_address"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.location_address}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  options={providers}
                  value={formik.values.provider}
                  getOptionLabel={(option) => option.name}
                  name={'provider'}
                  onBlur={formik.handleBlur}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    );
                  }}
                  onChange={(event, value) => {
                    getProviderLocation(value);
                    formik.setFieldValue('provider', value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      data-cy="provider-field"
                      name={'provider'}
                      error={Boolean(
                        formik.touched.provider && formik.errors.provider
                      )}
                      helperText={
                        formik.touched.provider && formik.errors.provider
                      }
                      fullWidth
                      {...params}
                      label={t('Provider*')}
                    />
                  )}
                />
              </Grid>

              {openProvLocation && providerLocations && (
                <Grid item xs={12}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs>
                      <Autocomplete
                        disablePortal
                        value={formik.values.providerLocation}
                        options={
                          !providerLocations
                            ? [{ label: 'Loading...', id: 0 }]
                            : providerLocations
                        }
                        getOptionLabel={(option: any) => {
                          if (option === '') return '';
                          return `[${option?.continent}] ${option?.country} - ${option?.city}`;
                        }}
                        onChange={(event, value) => {
                          formik.setFieldValue('providerLocation', value);
                          setOpenNewLocation(false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            data-cy="provider-locations-field"
                            fullWidth
                            {...params}
                            label={t('Provider Location*')}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        type="button"
                        onClick={handleAddLocation}
                      >
                        Add location
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </form>

          <div id="box">
            {openNewLocation && (
              <AddLocationForm
                initialValues={addLocationInitialData}
                addNewLocation={addNewLocation}
                handleCancelLocation={handleCancelLocation}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3
          }}
        >
          <Button
            data-cy="cancel-button"
            color="secondary"
            onClick={(event) => onClose(event)}
          >
            {t('Cancel')}
          </Button>
          <Button
            data-cy="submit-button"
            type="button"
            startIcon={
              formik.isSubmitting ? <CircularProgress size="1rem" /> : null
            }
            onClick={formik.handleSubmit}
            disabled={
              Boolean(formik.errors.submit) ||
              formik.isSubmitting ||
              !(formik.isValid && formik.dirty)
            }
            variant="contained"
          >
            {t('Next')}
          </Button>
        </DialogActions>
      </Collapse>

      <Collapse in={installStep === 2} timeout="auto" unmountOnExit>
        <DialogContent
          dividers
          sx={{
            p: 3
          }}
        >
          {connectionStatus === 'error' && (
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <Typography variant="h4">Cannot connect</Typography>
              <Typography color="red" sx={{ mt: 1 }} variant="h6">
                Error: {connectionError}
              </Typography>
            </div>
          )}
          <div ref={terminalRef}></div>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3
          }}
        >
          {installStep === 2 && (
            <Button color="secondary" onClick={(event) => handleCancel(event)}>
              {t('Go Back')}
            </Button>
          )}
          <Button
            color="warning"
            variant="contained"
            onClick={(event) => handleCancel(event)}
          >
            {t('Cancel')}
          </Button>
          {isRunningInstall === false && (
            <Button type="button" variant="contained" onClick={handleReinstall}>
              {t('Reinstall')}
            </Button>
          )}
          <Button
            type="button"
            disabled={!installSuccess || isSavingWorker}
            variant="contained"
            onClick={handleFinishInstall}
            startIcon={
              !installSuccess || isSavingWorker ? (
                <CircularProgress size="1rem" />
              ) : null
            }
          >
            {t('Add Worker')}
          </Button>
        </DialogActions>
      </Collapse>
    </>
  );
};

export default InstallWorker;
