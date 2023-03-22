import {MouseEventHandler} from 'react';
import {
    FieldArray,
    Formik,
    FormikHelpers,
    FormikValues,
    ErrorMessage
} from 'formik';
import {useTranslation} from 'react-i18next';
import {
    Paper,
    Grid,
    DialogContent,
    TextField,
    CircularProgress,
    Button,
    useTheme,
    DialogActions,
    Typography,
    Checkbox,
    FormControlLabel,
    Box
} from '@mui/material';
import * as Yup from 'yup';
import 'react-quill/dist/quill.snow.css';
import AddCircleIcon from '@mui/icons-material/Add';

interface FormProps {
    addBlocklist(
        values: FormikValues,
        formikHelpers: FormikHelpers<FormikValues>
    ): void | Promise<any>;

    handleCancel(event: MouseEventHandler<HTMLButtonElement>): void;

    initialData?: object;
}

const defaultProps = {
    addBlocklist: () => {
    },
    handleCancel: () => {
    },
    initialData: {}
};


const AddBlocklistForm = (props: FormProps = defaultProps) => {
    const {addBlocklist, handleCancel, initialData} = props;
    const {t}: { t: any } = useTranslation();
    const theme = useTheme();
    const initialValues = {
        domain: '',
        description: '',
        delist_url: '',
        responseArray: [
            {
                code: '',
                description: ''
            }
        ],
        ipv4: false,
        ipv6: false,
        dom: false,
        asn: false,
        submit: null,
        ...initialData
    };


    const validationSchema = Yup.object().shape({
        domain: Yup.string().max(255).required(t('The domain field is required')),
        delist_url: Yup.string()
            .url('Please enter a valid URL')
            .max(255)
            .required(t('The delist url field is required'))
            .nullable()
        ,
        description: Yup.string()
            .max(255)
            .required(t('The description field is required')),
        responseArray: Yup.array().of(
            Yup.object().shape({
                code: Yup.string().required(t('The code field is required')),
                description: Yup.string().required(
                    t('The code description field is required')
                )
            })
        )
    });

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addBlocklist}
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
                        sx={{
                            p: 1.5
                        }}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        px: 1,
                                        mx: 1,
                                        mb: 1,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.ipv4}
                                                onChange={(e) => {
                                                    setFieldValue('ipv4', e.target.checked);
                                                }}
                                            />
                                        }
                                        label="IPV4"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.ipv6}
                                                onChange={(e) => {
                                                    setFieldValue('ipv6', e.target.checked);
                                                }}
                                            />
                                        }
                                        label="IPV6"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.dom}
                                                onChange={(e) => {
                                                    setFieldValue('dom', e.target.checked);
                                                }}
                                            />
                                        }
                                        label="DOMAIN"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.asn}
                                                onChange={(e) => {
                                                    setFieldValue('asn', e.target.checked);
                                                }}
                                            />
                                        }
                                        label="ASN"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
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
                                <TextField
                                    error={Boolean(touched.description && errors.description)}
                                    fullWidth
                                    helperText={touched.description && errors.description}
                                    label={t('Description')}
                                    name="description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.description}
                                    variant="outlined"
                                    sx={{mt: 3}}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={Boolean(touched.delist_url && errors.delist_url)}
                                    fullWidth
                                    helperText={touched.delist_url && errors.delist_url}
                                    label={t('Delist URL')}
                                    name="delist_url"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.delist_url}
                                    variant="outlined"
                                    sx={{mt: 3}}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 3}}>
                                    <FieldArray name="responseArray">
                                        {({insert, remove, push}) => (
                                            <>
                                                <Grid item xs={12} sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Typography variant={'h4'} sx={{ml: 1}}>Response Codes</Typography>
                                                    <Button
                                                        style={{backgroundColor: 'transparent'}}
                                                        onClick={() => {
                                                            push({
                                                                responseCode: '',
                                                                responseText: ''
                                                            });
                                                        }}
                                                        type="button"
                                                    >
                                                        Add new error status {''}
                                                        <AddCircleIcon/>
                                                    </Button>

                                                </Grid>
                                                <Grid item xs={12} sx={{
                                                    overflowY: 'auto',
                                                    mt: 1,
                                                    border: '1px solid gray',
                                                    borderRadius: 1,
                                                    height: '270px'
                                                }}>

                                                    {values.responseArray.map((value, index) => (
                                                        <Box sx={{display: 'flex', pl: 1, pt: 2}}>
                                                            <Box flex={'column'}>
                                                                <TextField
                                                                    sx={{
                                                                        '& fieldset': {
                                                                            borderTopRightRadius: 0,
                                                                            borderBottomRightRadius: 0
                                                                        }
                                                                    }}
                                                                    size={'small'}
                                                                    fullWidth
                                                                    label={t('Response Code')}
                                                                    name={`responseArray.${index}.code`}
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    value={value.code}
                                                                    variant="outlined"
                                                                />
                                                                <ErrorMessage name={`responseArray.${index}.code`}>
                                                                    {(msg) => (
                                                                        <Typography sx={{color: 'red'}}>
                                                                            {msg}
                                                                        </Typography>
                                                                    )}
                                                                </ErrorMessage>
                                                            </Box>
                                                            <Box flex={'column'} sx={{flex: 1}}>
                                                                <TextField
                                                                    size={'small'}
                                                                    sx={{
                                                                        '& fieldset': {
                                                                            borderTopLeftRadius: 0,
                                                                            borderBottomLeftRadius: 0
                                                                        }
                                                                    }}
                                                                    fullWidth
                                                                    label={t('Response Description')}
                                                                    name={`responseArray.${index}.description`}
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    value={value.description}
                                                                    variant="outlined"
                                                                />
                                                                <ErrorMessage
                                                                    name={`responseArray.${index}.description`}
                                                                >
                                                                    {(msg) => (
                                                                        <Typography sx={{color: 'red'}}>
                                                                            {msg}
                                                                        </Typography>
                                                                    )}
                                                                </ErrorMessage>
                                                            </Box>

                                                            <Button
                                                                sx={{
                                                                    width: '10%',

                                                                }}
                                                                style={{backgroundColor: 'transparent'}}
                                                                onClick={() => remove(index)}
                                                                type="button"
                                                            >
                                                                Remove
                                                            </Button>
                                                        </Box>
                                                    ))}
                                                </Grid>
                                            </>
                                        )}
                                    </FieldArray>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography align="center" marginTop={2} color="error" variant="h4">
                                    {errors.submit}
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            p: 3,
                            borderTop: 1,
                            borderColor: 'grey.300'
                        }}
                        style={{
                            position: 'sticky',
                            bottom: '0px',
                            background: 'white',
                            zIndex: 5
                        }}
                    >
                        <Button color="secondary" onClick={(event) => handleCancel(event)}>
                            {t('Cancel')}
                        </Button>
                        {initialData ? (
                            <Button
                                type="submit"
                                startIcon={
                                    isSubmitting ? <CircularProgress size="1rem"/> : null
                                }
                                disabled={Boolean(errors.submit) || isSubmitting}
                                variant="contained"
                            >
                                {t('Edit blocklist')}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                startIcon={
                                    isSubmitting ? <CircularProgress size="1rem"/> : null
                                }
                                disabled={Boolean(errors.submit) || isSubmitting}
                                variant="contained"
                            >
                                {t('Add blocklist ')}
                            </Button>
                        )}
                    </DialogActions>
                </form>
            )}
        </Formik>
    );
};

export default AddBlocklistForm;
