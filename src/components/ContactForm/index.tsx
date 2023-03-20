import { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { apiInstance } from 'src/config/api';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useSnackbar } from 'notistack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Autocomplete,
  IconButton,
  useTheme
} from '@mui/material';

const ContactForm = () => {
  const theme = useTheme();
  const [photo, setPhoto] = useState(null);
  const [photoLabel, setPhotoLabel] = useState('');
  const [photoErroMessage, setPhotoErrorMessage] = useState('');
  const [showPhotoErrorMessage, setShowPhotoErrorMessage] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const subjects = [
    'Say hello',
    'Report a bug',
    'Propose a feature',
    'Ask a question'
  ];

  const handleSubmit = async (_values) => {
    if (showPhotoErrorMessage) return;
    const recaptchaToken = await handleReCaptchaVerify();
    const data = {
      subject: _values.subject,
      sender_email: _values.email,
      sender_name: _values.name,
      message: _values.message,
      photo: photo,
      photo_label: photoLabel,
      recaptcha: recaptchaToken
    };
    try {
      await apiInstance.sendEmail(data);
      enqueueSnackbar(
        'Thank your for contacting us! We will get back to you soon.',
        {
          variant: 'info',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          },
          autoHideDuration: 2000
        }
      );
    } catch (err) {
      enqueueSnackbar('Oops! An error occurred, please try again later.', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        },
        autoHideDuration: 2000
      });
    }
    setPhoto(null);
    setPhotoLabel('');
    setPhotoErrorMessage('');
    setShowPhotoErrorMessage(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      subject: null,
      name: '',
      email: '',
      message: '',
      photo: ''
    },
    validationSchema: Yup.object().shape({
      subject: Yup.string()
        .oneOf(subjects)
        .required('Subject field is required')
        .nullable(),
      name: Yup.string()
        .min(3, 'Name too short.')
        .required('Name field is required'),
      email: Yup.string()
        .email('Invalid email address.')
        .required('Email field is required'),
      message: Yup.string()
        .min(20, 'Please tell us more...')
        .required('Message field is required')
    }),
    onSubmit: handleSubmit
  });

  // google recaptcha
  const { executeRecaptcha } = useGoogleReCaptcha();
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    const token = await executeRecaptcha('run_ping');
    return token;
  }, [executeRecaptcha]);

  return (
    <>
      <Paper>
        <Box sx={{ textAlign: 'center', pt: 5 }}>
          <Typography variant={'h3'}>Get in touch</Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: 3
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{ maxWidth: '600px', marginRight: 2 }}
              >
                <Grid item xs={12} md={12}>
                  <Autocomplete
                    disablePortal
                    disableClearable={true}
                    size="small"
                    onChange={(_, value) => {
                      formik.setFieldValue('subject', value);
                    }}
                    options={subjects}
                    renderInput={(params) => (
                      <TextField
                        error={Boolean(
                          formik.touched.subject && formik.errors.subject
                        )}
                        helperText={
                          formik.touched.subject && formik.errors.subject
                        }
                        fullWidth
                        {...params}
                        label={'Subject'}
                      />
                    )}
                    value={formik.values.subject}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    size="small"
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    fullWidth
                    type="name"
                    autoComplete="off"
                    helperText={formik.touched.name && formik.errors.name}
                    label={'Name'}
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    fullWidth
                    type="email"
                    size="small"
                    autoComplete="off"
                    helperText={formik.touched.email && formik.errors.email}
                    label={'E-mail'}
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: {
                      xs: 'none',
                      md: 'flex'
                    }
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{ width: '100%' }}
                    component="label"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
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
                </Grid>
                {showPhotoErrorMessage && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: {
                        xs: 'none',
                        md: 'flex'
                      },
                      justifyContent: 'center'
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        color: theme.colors.error.main
                      }}
                    >
                      {photoErroMessage}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    mt: {
                      xs: 2,
                      md: 0
                    }
                  }}
                >
                  <TextField
                    size="small"
                    error={Boolean(
                      formik.touched.message && formik.errors.message
                    )}
                    fullWidth
                    autoComplete="off"
                    helperText={formik.touched.message && formik.errors.message}
                    label={'Message'}
                    name="message"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.message}
                    variant="outlined"
                    multiline
                    rows={9.5}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: {
                      xs: 'flex',
                      md: 'none'
                    }
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{ width: '100%', mt: 1 }}
                    component="label"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
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
                </Grid>
                {showPhotoErrorMessage && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: {
                        xs: 'flex',
                        md: 'none'
                      },
                      justifyContent: 'center'
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        color: theme.colors.error.main
                      }}
                    >
                      {photoErroMessage}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
            {photo && photoLabel && (
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
                {/* <img  src={photo}  style={{
                width: '100%',
                height: '100%',
            }} />   */}
                <Typography>{photoLabel}</Typography>
                <IconButton
                  sx={{ marginLeft: 1, color: 'red' }}
                  onClick={() => {
                    setPhoto(null);
                    setPhotoLabel('');
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Box>
            )}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                sx={{
                  marginTop: 2,
                  width: '50%'
                }}
                type="submit"
                variant={'contained'}
              >
                Send message
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </>
  );
};

export default ContactForm;
