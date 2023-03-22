import { useFormik, FormikProvider, Form } from 'formik';
import * as Yup from 'yup';
import DatePicker from '@mui/lab/DatePicker';
import {
  Grid,
  TextField,
  CircularProgress,
  Button,
  Typography,
  IconButton,
  CardMedia,
  Box,
  Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  deleteObject
} from 'firebase/storage';
import { useEffect, useState } from 'react';
import Link from 'src/components/Link';
import { addWorkerHardware } from '@/services/hardware-stock';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { useAuth } from '@/hooks/useAuth';

const addProps = {
  handleHardwerAdded: PropTypes.func
};

type AddProps = PropTypes.InferProps<typeof addProps>;

function AddHardwareForm({ handleHardwerAdded }: AddProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [photo, setPhoto] = useState(null);
  const [photoLabel, setPhotoLabel] = useState('');
  const [photoErrorMessage, setPhotoErrorMessage] = useState('');
  const [showPhotoErrorMessage, setShowPhotoErrorMessage] = useState(false);
  const [percent, setPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [path, setPath] = useState('');
  const [url, setUrl] = useState('');
  const { user } = useAuth();

  const handleFileUpload = (name, file, location) => {
    setUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `/${location}/${name}`);
    setPath(`/${location}}/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
        if (percent == 100) setUploading(false);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUrl(url);
          formik.setFieldValue('invoice', url);
        });
      }
    );
  };

  const handleFileDelete = (path) => {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    deleteObject(storageRef).catch((error) => {
      console.log(error);
    });
  };

  const handleSubmit = async (_values) => {
    setPhotoErrorMessage('');
    setShowPhotoErrorMessage(false);
    if (_values.invoice.length === 0) {
      setPhotoErrorMessage('Invoice is required');
      setShowPhotoErrorMessage(true);
      return;
    }
    try {
      formik.setSubmitting(true);
      await addWorkerHardware(_values);
      formik.resetForm();
      formik.setStatus({ success: true });
      formik.setSubmitting(false);
      handleHardwerAdded();
    } catch (err) {
      console.error(err);
      formik.setStatus({ success: false });
      formik.setErrors({ submit: err.message });
      enqueueSnackbar('Something went wrong, please try again!', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        autoHideDuration: 2000
      });
    }
  };

  const regex = /^[a-zA-Z0-9-./]{5,30}$/;

  const formik = useFormik({
    onSubmit: handleSubmit,
    initialValues: {
      brand: '',
      model: '',
      mac_address: '',
      serial_number: '',
      acquisition_date: '',
      warranty_term: '',
      acquisition_price: null,
      supplier: '',
      invoice: ''
    },
    validationSchema: Yup.object({
      brand: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Brand field is required'),
      model: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Model filed required'),
      serial_number: Yup.string()
        .matches(regex, 'Invalid Serial Number format')
        .min(5, 'Serial Number must be at least 5 characters')
        .max(30, 'Serial Number cannot be more than 30 characters')
        .required('Serial Number is required'),
      mac_address: Yup.string()
        .test('mac_address', 'Invalid mac address', (value) => {
          if (value) {
            const regex =
              /^((([0-9A-F]{2}:){5})|(([0-9A-F]{2}-){5})|([0-9A-F]{10}))([0-9A-F]{2})$/i;
            return value.match(regex);
          }
          return true;
        })
        // .max(20, 'Must be 20 characters or less')
        .required('MAC Address field is required'),
      acquisition_date: Yup.date().required(
        'Acquisition Date field is required'
      ),
      warranty_term: Yup.string()
        .min(3, 'Must be 3 characters or more')
        .max(20, 'Must be 20 characters or less')
        .required('Warranty Period field is required'),
      acquisition_price: Yup.number()
        .nullable()
        // .max(20, 'Must be 20 characters or less')
        .required('Acquisition Price field is required'),
      supplier: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Supplier field is required')
    })
  });

  return (
    <>
      <FormikProvider value={formik}>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/*<Typography data-cy="mandatory-field" sx={{ pl: 4, pt: 1 }}>*/}
            {/*    Fields marked with * are mandatory*/}
            {/*</Typography>*/}
            <Grid item xs={12} sm={12}>
              <Typography variant={'h5'} marginBottom={1} paddingLeft={1}>
                Technical Information
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                data-cy="brand"
                error={Boolean(formik.touched.brand && formik.errors.brand)}
                fullWidth
                helperText={formik.touched.brand && formik.errors.brand}
                label={'Brand'}
                name="brand"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  const trimed = e.target.value.trim();
                  formik.setFieldValue('brand', trimed);
                }}
                value={formik.values.brand}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                data-cy="model"
                error={Boolean(formik.touched.model && formik.errors.model)}
                fullWidth
                helperText={formik.touched.model && formik.errors.model}
                label={'Model'}
                name="model"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  const trimed = e.target.value.trim();
                  formik.setFieldValue('model', trimed);
                }}
                value={formik.values.model}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                data-cy="serial_number"
                error={Boolean(
                  formik.touched.serial_number && formik.errors.serial_number
                )}
                fullWidth
                helperText={
                  formik.touched.serial_number && formik.errors.serial_number
                }
                label={'Serial Number'}
                name="serial_number"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  const trimed = e.target.value.trim();
                  formik.setFieldValue('serial_number', trimed);
                }}
                value={formik.values.serial_number}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                data-cy="mac_address"
                error={Boolean(
                  formik.touched.mac_address && formik.errors.mac_address
                )}
                fullWidth
                helperText={
                  formik.touched.mac_address && formik.errors.mac_address
                }
                label={'Mac Address'}
                name="mac_address"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  const trimed = e.target.value.trim();
                  formik.setFieldValue('mac_address', trimed);
                }}
                value={formik.values.mac_address}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant={'h5'} marginBottom={1} paddingLeft={1}>
                Billing Information
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                value={formik.values.acquisition_date}
                onChange={(value) => {
                  if (!value) {
                    formik.setFieldValue('acquisition_date', '');
                    return;
                  }
                  if (!(value instanceof Date && !isNaN(value))) {
                    formik.setFieldTouched('acquisition_date', true, false);
                    formik.setFieldError('acquisition_date', 'Invalid date');
                    return;
                  }
                  const date = new Date(value);
                  formik.setFieldValue(
                    'acquisition_date',
                    format(value, date.toISOString().substring(0, 10))
                  );
                }}
                label={'Acquisition Date'}
                renderInput={(params) => (
                  <TextField
                    data-cy="acquis-date-field"
                    {...params}
                    variant="outlined"
                    fullWidth
                    name="acquisition_date"
                    error={Boolean(
                      formik.touched.acquisition_date &&
                        formik.errors.acquisition_date
                    )}
                    helperText={
                      formik.touched.acquisition_date &&
                      formik.errors.acquisition_date
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                data-cy="warranty_term"
                error={Boolean(
                  formik.touched.warranty_term && formik.errors.warranty_term
                )}
                fullWidth
                helperText={
                  formik.touched.warranty_term && formik.errors.warranty_term
                }
                label={'Warranty Period (in days)'}
                name="warranty_term"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  const trimed = e.target.value.trim();
                  formik.setFieldValue('warranty_term', trimed);
                }}
                value={formik.values.warranty_term}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type={'number'}
                data-cy="acquisition_price"
                error={Boolean(
                  formik.touched.acquisition_price &&
                    formik.errors.acquisition_price
                )}
                fullWidth
                helperText={
                  formik.touched.acquisition_price &&
                  formik.errors.acquisition_price
                }
                label={'Acquisition Price ($)'}
                name="acquisition_price"
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue('acquisition_price', e.target.value)
                }
                value={formik.values.acquisition_price}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                data-cy="supplier"
                error={Boolean(
                  formik.touched.supplier && formik.errors.supplier
                )}
                fullWidth
                helperText={formik.touched.supplier && formik.errors.supplier}
                label={'Supplier'}
                name="supplier"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  const trimed = e.target.value.trim();
                  formik.setFieldValue('supplier', trimed);
                }}
                value={formik.values.supplier}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant={'h5'} marginBottom={1} paddingLeft={1}>
                Invoice
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              {' '}
              <Button
                variant="contained"
                sx={{ width: '100%' }}
                component="label"
                startIcon={<CloudUploadIcon />}
                data-cy="upload-logo-button"
              >
                Upload Invoice
                <input
                  name="photo"
                  accept="image/jpg, image/png, image/jpeg, application/pdf"
                  id="contained-button-file"
                  type="file"
                  hidden
                  onChange={(e) => {
                    const fileReader = new FileReader();
                    fileReader.onload = () => {
                      if (fileReader.readyState === 2) {
                        setPhoto(fileReader.result);
                      }
                    };
                    if (!e.target.files[0]) return;
                    setPhoto(null);
                    setPhotoLabel('');
                    setPhotoErrorMessage('');
                    setShowPhotoErrorMessage(false);
                    if (e.target.files[0].size > 5 * 1024 * 1024) {
                      setPhotoErrorMessage('File is too large!');
                      setShowPhotoErrorMessage(true);
                      return;
                    }
                    setPhotoLabel(e.target.files[0].name);
                    handleFileUpload(
                      e.target.files[0].name,
                      e.target.files[0],
                      'hardware_invoices'
                    );

                    fileReader.readAsDataURL(e.target.files[0]);
                  }}
                />
              </Button>
              {uploading && (
                <Box
                  sx={{
                    padding: 2,
                    marginTop: 2,
                    border: '1px dashed',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <CircularProgress size="1rem" />
                </Box>
              )}
              {photoErrorMessage && (
                <Box
                  sx={{
                    padding: 2,
                    color: 'red',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Typography>{photoErrorMessage}</Typography>
                </Box>
              )}
              {photo && photoLabel && url && (
                <Box
                  sx={{
                    padding: 2,
                    marginTop: 2,
                    border: '1px dashed',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Link href={formik.values.invoice} target={'_blank'}>
                    <Typography>{photoLabel}</Typography>
                  </Link>
                  <IconButton
                    sx={{ marginLeft: 1, color: 'red' }}
                    onClick={() => {
                      setPhoto(null);
                      setPhotoLabel('');
                      handleFileDelete(path);
                      formik.setFieldValue('invoice', '');
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} align={'center'}>
              <Button
                variant="contained"
                type={'submit'}
                disabled={formik.values.invoice.length === 0}
              >
                Add Hardware
              </Button>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </>
  );
}

AddHardwareForm.propTypes = addProps;

export default AddHardwareForm;
