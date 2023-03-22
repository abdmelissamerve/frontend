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
  Typography,
  MenuItem,
  Box,
  IconButton,
  CardActionArea,
  CardMedia,
  Card,
  Autocomplete
} from '@mui/material';
import * as Yup from 'yup';
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  deleteObject
} from 'firebase/storage';
import ClearIcon from '@mui/icons-material/Clear';

interface FormProps {
  addOrganisation(values: FormikValues): void | Promise<any>;

  handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;
  initialData?: object;
  errMessage?: string;
}

const defaultProps = {
  addOrganisation: () => {},
  handleCancel: () => {},
  initialData: {},
  errMessage: ''
};

const AddOrganisationForm = (props: FormProps = defaultProps) => {
  const { addOrganisation, handleCancel, initialData, errMessage } = props;
  const [photo, setPhoto] = useState(null);
  const [photoLabel, setPhotoLabel] = useState('');
  const [photoErroMessage, setPhotoErrorMessage] = useState('');
  const [showPhotoErrorMessage, setShowPhotoErrorMessage] = useState(false);
  const [percent, setPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [path, setPath] = useState('');
  const [url, setUrl] = useState('');
  const { t }: { t: any } = useTranslation();

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      formik.setSubmitting(true);
      addOrganisation({
        name: formik.values.name,
        website: formik.values.website,
        logo_url: url,
        email: formik.values.email,
        role: formik.values.role
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
    name: Yup.string()
      .max(255)
      .required(t('The organisation name field is required')),
    website: Yup.string()
      .test(
        'check-url',
        'This field should be a valid URL.',
        function isValidHttpUrl(string) {
          let url;

          try {
            url = new URL(string);
          } catch (_) {
            return false;
          }

          return url.protocol === 'http:' || url.protocol === 'https:';
        }
      )
      .required(t('The website field is required')),
    email: Yup.string().when([], {
      is: () => !initialData,
      then: Yup.string().required('Email field is required'),
      otherwise: Yup.string().notRequired()
    }),
    role: Yup.string().when([], {
      is: () => !initialData,
      then: Yup.string().required('Role field is required'),
      otherwise: Yup.string().notRequired()
    })
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      website: '',
      logo_url: '',
      email: '',
      role: 'member',
      submit: null,
      ...initialData
    },
    onSubmit: handleSubmit,
    validationSchema: validationSchema
  });

  const handleFileUpload = (name, file) => {
    setUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `/organisation_logo/${name}`);
    setPath(`/organisation_logo/${name}`);
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
          formik.setFieldValue('logo_url', url);
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
              data-cy="website-field"
              error={Boolean(formik.touched.website && formik.errors.website)}
              fullWidth
              helperText={formik.touched.website && formik.errors.website}
              label={t('Website')}
              name="website"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.website}
              variant="outlined"
            />
          </Grid>
          {!initialData && [
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
            </Grid>,

            <Grid item xs={12}>
              <Autocomplete
                disableClearable
                disablePortal
                options={['member', 'owner', 'admin']}
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
          ]}

          <Grid item xs={12}>
            <Typography align="center" color="error" variant="h4">
              {errMessage}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {' '}
            <Button
              variant="contained"
              sx={{ width: '100%' }}
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={!formik.values.name}
              data-cy="upload-logo-button"
            >
              Upload Logo
              <input
                name="photo"
                accept="image/jpg, image/png, image/jpeg"
                id="contained-button-file"
                type="file"
                hidden
                onChange={(e) => {
                  setPhoto(null);
                  setPhotoLabel('');
                  setPhotoErrorMessage('');
                  setShowPhotoErrorMessage(false);
                  const fileReader = new FileReader();
                  fileReader.onload = () => {
                    if (fileReader.readyState === 2) {
                      setPhoto(fileReader.result);
                    }
                  };

                  handleFileUpload(e.target.files[0].name, e.target.files[0]);
                  setPhotoLabel(e.target.files[0].name);
                  if (e.target.files[0].size > 5 * 1024 * 1024) {
                    setPhotoErrorMessage('File is too large!');
                    setShowPhotoErrorMessage(true);
                    return;
                  }
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
                <Typography>{photoLabel}</Typography>
                <IconButton
                  sx={{ marginLeft: 1, color: 'red' }}
                  onClick={() => {
                    setPhoto(null);
                    setPhotoLabel('');
                    handleFileDelete(path);
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Box>
            )}
            {initialData?.logo_url && !photo && !photoLabel && (
              <Box
                sx={{
                  maxWidth: 380,
                  margin: '0 auto',
                  padding: '0.1em'
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={initialData.logo_url}
                  alt={'alt'}
                  sx={{ padding: '1em 1em 0 1em', objectFit: 'contain' }}
                />
              </Box>
            )}
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
            disabled={!formik.isValid}
            variant="contained"
            data-cy="edit-button-form"
          >
            {t('Edit organisation')}
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
            {t('Add new organisation')}
          </Button>
        )}
      </DialogActions>
    </form>
  );
};

export default AddOrganisationForm;
