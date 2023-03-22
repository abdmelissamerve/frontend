import { MouseEventHandler, useState } from 'react';
import {
  ErrorMessage,
  FieldArray,
  Formik,
  FormikHelpers,
  FormikValues
} from 'formik';
import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Grid,
  Card,
  TextField,
  CircularProgress,
  Button,
  Typography,
  DialogContent,
  DialogActions,
  useTheme,
  Box,
  styled,
  FormHelperText,
  Link,
  Autocomplete,
  InputAdornment,
  IconButton
} from '@mui/material';
import * as Yup from 'yup';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Visibility from '@mui/icons-material/Visibility';
import AddCircleIcon from '@mui/icons-material/Add';
import Statistics from '@/content/Management/Invoices/Statistics';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EditorWrapper = styled(Box)(
  ({ theme }) => `

    .ql-editor {
      min-height: 100px;
    }

    .ql-snow .ql-picker {
      color: ${theme.colors.alpha.black[100]};
    }

    .ql-snow .ql-stroke {
      stroke: ${theme.colors.alpha.black[100]};
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`
);

const publishedOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
];

interface LocationProps {
  addProvider(
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ): void | Promise<any>;
  handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;
  handleFileUpload: Function;
  handleFileDelete: Function;
  initialData?: object;
  path: string;
}

const defaultProps = {
  addProvider: () => {},
  handleCancel: () => {},
  handleFileUpload: () => {},
  handleFileDelete: () => {},
  initialData: {},
  path: ''
};

const ProviderForm = (props: LocationProps = defaultProps) => {
  const theme = useTheme();
  const [photo, setPhoto] = useState(null);
  const [photoLabel, setPhotoLabel] = useState('');
  const [photoErroMessage, setPhotoErrorMessage] = useState('');
  const [showPhotoErrorMessage, setShowPhotoErrorMessage] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const {
    addProvider,
    handleCancel,
    initialData,
    handleFileDelete,
    handleFileUpload,
    path
  } = props;
  const { t }: { t: any } = useTranslation();
  const initialValues = {
    name: '',
    website: '',
    loginUrl: '',
    affiliateUrl: '',
    description: '',
    services: '',
    password: '',
    published: { label: 'No', value: false },
    statistics: [],
    submit: null,
    ...initialData
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required(t('The name field is required')),
    website: Yup.string()
      .test('check-url', 'Input a valid url', function isValidHttpUrl(string) {
        let url;

        try {
          url = new URL(string);
        } catch (_) {
          return false;
        }

        return url.protocol === 'http:' || url.protocol === 'https:';
      })
      .required(t('The website field is required')),
    loginUrl: Yup.string()
      .test('check-url', 'Input a valid url', function isValidHttpUrl(string) {
        let url;

        try {
          url = new URL(string);
        } catch (_) {
          return false;
        }

        return url.protocol === 'http:' || url.protocol === 'https:';
      })
      .required('The login url field is required'),
    affiliateUrl: Yup.string()
      .test('check-url', 'Input a valid url', function isValidHttpUrl(string) {
        let url;

        try {
          url = new URL(string);
        } catch (_) {
          return false;
        }
        return url.protocol === 'http:' || url.protocol === 'https:';
      })
      .required(t('The affiliate url field is required')),
    description: Yup.string().nullable(),
    services: Yup.string().nullable(),
    statistics: Yup.array()
      .of(
        Yup.object().shape({
          number: Yup.string().required(t('The number field is required')),
          label: Yup.string().required(
            t('The label description field is required')
          )
        })
      )
      .test({
        message: 'You can input maximum 3 statistics fields',
        test: (arr) => arr.length > 2 || arr.length < 2
      })
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={addProvider}
      validationSchema={validationSchema}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        setFieldValue,
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
                <Grid container justifyContent={'center'} spacing={3}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Name')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
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
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Website')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(touched.website && errors.website)}
                      fullWidth
                      helperText={touched.website && errors.website}
                      label={t('Website')}
                      name="website"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.website}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Login Url')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(touched.loginUrl && errors.loginUrl)}
                      fullWidth
                      helperText={touched.loginUrl && errors.loginUrl}
                      label={t('Login URL')}
                      name="loginUrl"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.loginUrl}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Affiliate link')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(
                        touched.affiliateUrl && errors.affiliateUrl
                      )}
                      fullWidth
                      helperText={touched.affiliateUrl && errors.affiliateUrl}
                      label={t('Affiliate Link')}
                      name="affiliateUrl"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.affiliateUrl}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Description')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <EditorWrapper>
                      <ReactQuill
                        formats={['size', 'bold', 'font', 'italic', 'header']}
                        onChange={(v) => setFieldValue('description', v)}
                        value={values.description}
                      />

                      <FormHelperText
                        error={Boolean(
                          touched.description && errors.description
                        )}
                      >
                        {touched.description && errors.description}
                      </FormHelperText>
                    </EditorWrapper>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Services')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <EditorWrapper>
                      <ReactQuill
                        formats={['size', 'bold', 'font', 'italic', 'header']}
                        onChange={(v) => setFieldValue('services', v)}
                        value={values.services}
                      />

                      <FormHelperText
                        error={Boolean(touched.services && errors.services)}
                      >
                        {touched.services && errors.services}
                      </FormHelperText>
                    </EditorWrapper>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`
                      }}
                      alignSelf="center"
                    ></Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`,
                      display: 'flex'
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      autoComplete="new-password"
                      sx={{ mr: 1 }}
                      fullWidth
                      label={t('Password')}
                      name="password"
                      type={passwordShown ? 'text' : 'password'}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
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
                    <Autocomplete
                      fullWidth
                      disablePortal
                      disableClearable
                      options={publishedOptions}
                      isOptionEqualToValue={(option) => option.label || ''}
                      defaultValue={values.published}
                      onChange={(event, value) => {
                        setFieldValue('published', value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          label={t('Page Published')}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Logo')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Button
                      variant="contained"
                      sx={{ width: '100%' }}
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      disabled={!values.name}
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
                          setPhotoLabel(e.target.files[0].name);
                          handleFileUpload(
                            e.target.files[0].name,
                            e.target.files[0]
                          );
                          if (e.target.files[0].size > 5 * 1024 * 1024) {
                            setPhotoErrorMessage('File is too large!');
                            setShowPhotoErrorMessage(true);
                            return;
                          }
                          fileReader.readAsDataURL(e.target.files[0]);
                        }}
                      />
                    </Button>
                    {!values.name && (
                      <Typography color="gray" sx={{ fontSize: 13, p: 1 }}>
                        The name field is required to upload the logo.
                      </Typography>
                    )}
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
                            handleFileDelete(path);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </Box>
                    )}
                    {initialData?.logo && !photo && !photoLabel && (
                      <Box
                        component="img"
                        sx={{
                          py: 2,
                          height: '100%',
                          width: '100%'
                        }}
                        alt={initialData?.name + ' logo'}
                        src={initialData?.logo}
                      />
                    )}
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
                  <Grid item xs={12}>
                    <FieldArray name="statistics">
                      {({ remove, push }) => (
                        <Box display="flex">
                          <Grid
                            item
                            xs={12}
                            sm={4}
                            md={3}
                            justifyContent="flex-end"
                            textAlign={{ sm: 'right' }}
                            flex={'column'}
                          >
                            <Button
                              sx={{ mt: 1 }}
                              onClick={() => {
                                push({
                                  number: '',
                                  label: ''
                                });
                              }}
                              type="button"
                              disabled={values.statistics.length > 2}
                            >
                              Add statistics field {''}
                              <AddCircleIcon />
                            </Button>
                          </Grid>

                          <Grid
                            display="flex"
                            flexDirection={'column'}
                            sx={{
                              mb: `${theme.spacing(3)}`,
                              ml: 1
                            }}
                            item
                            xs={12}
                            sm={8}
                            md={9}
                          >
                            {values.statistics.map((value, index) => (
                              <Box sx={{ display: 'flex', py: 1 }} key={index}>
                                <Box flex={'column'}>
                                  <TextField
                                    sx={{ mr: 1 }}
                                    label={t('number')}
                                    name={`statistics.${index}.number`}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={value.number}
                                    variant="outlined"
                                  />
                                  <ErrorMessage
                                    name={`statistics.${index}.number`}
                                  >
                                    {(msg) => (
                                      <Typography sx={{ color: 'red' }}>
                                        {msg}
                                      </Typography>
                                    )}
                                  </ErrorMessage>
                                </Box>
                                <Box flex={'column'} sx={{ flex: 1 }}>
                                  <TextField
                                    fullWidth
                                    label={t('Label')}
                                    name={`statistics.${index}.label`}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={value.label}
                                    variant="outlined"
                                  />
                                  <ErrorMessage
                                    name={`statistics.${index}.label`}
                                  >
                                    {(msg) => (
                                      <Typography sx={{ color: 'red' }}>
                                        {msg}
                                      </Typography>
                                    )}
                                  </ErrorMessage>
                                </Box>
                                <Button
                                  style={{ backgroundColor: 'transparent' }}
                                  onClick={() => remove(index)}
                                  type="button"
                                >
                                  Remove
                                </Button>
                              </Box>
                            ))}
                            {!values.statistics.length ||
                              (values.statistics.length < 3 && (
                                <Typography color="error">
                                  You should add 3 elements.
                                </Typography>
                              ))}
                          </Grid>
                        </Box>
                      )}
                    </FieldArray>
                  </Grid>
                </Grid>
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
            {initialData == undefined ? (
              <Button
                type="submit"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={Boolean(errors.submit) || isSubmitting}
                variant="contained"
              >
                {t('Add new provider')}
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
                {t('Edit provider')}
              </Button>
            )}
          </DialogActions>
        </form>
      )}
    </Formik>
  );
};

export default ProviderForm;
