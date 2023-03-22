import * as Yup from 'yup';
import { useFormik, ErrorMessage, Field, FormikProvider, Form } from 'formik';
import {
  Grid,
  Autocomplete,
  TextField,
  Divider,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { useRefMounted } from '@/hooks/useRefMounted';
import { useCallback, useEffect, useState } from 'react';
import { useFetchData } from '@/hooks/useFetch';
import { getUsers } from '@/services/users';
import { getAllHardwareStock } from '@/services/hardware-stock';
import { assignHardwareToTechnician } from '@/services/hardware-stock';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import generateReport from './ReportGenerator';

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  deleteObject
} from 'firebase/storage';

const assignHardwareFormProps = {
  handleAssignSuccess: PropTypes.func
};

type AssignHardwareFormProps = PropTypes.InferProps<
  typeof assignHardwareFormProps
>;

function AssignHardwareForm({ handleAssignSuccess }: AssignHardwareFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useRefMounted();

  const { data: technicians, fetchData: getAllUsers } = useFetchData(getUsers);
  const {
    data: hardware,
    loading: hardwareLoading,
    fetchData: getHardware
  } = useFetchData(getAllHardwareStock);
  const getUsersAndHardwareCallback = useCallback(() => {
    getAllUsers({});
    getHardware({
      type: 'free'
    });
  }, [isMountedRef]);

  useEffect(() => {
    getUsersAndHardwareCallback();
  }, [getUsersAndHardwareCallback]);

  const handleFileUpload = async (name, file, location) => {
    const storage = getStorage();
    const storageRef = ref(storage, `/${location}/${name}`);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const url = await getDownloadURL(uploadTask.ref);
    return url;
  };

  const handleSubmit = async (_values) => {
    const assignedHardware = Array.from(
      { length: _values.nrOfHardwares },
      () =>
        hardware.worker_hardware_list.splice(
          Math.floor(Math.random() * hardware.worker_hardware_list.length),
          1
        )[0]
    );
    const reportsArray = await Promise.all(
      assignedHardware.map(async (item) => ({
        blob: await generateReport(item, _values.technician),
        id: item.id
      }))
    );

    const urlArray = await Promise.all(
      reportsArray.map(async (item) => ({
        url: await handleFileUpload(
          Math.floor(Math.random() * 899999 + 100000),
          item.blob,
          'hardware_reports'
        ),
        id: item.id
      }))
    );

    const assignData = {
      technician_id: _values.technician.id,
      worker_hardware_ids: assignedHardware.map((item) => item.id),
      reports: urlArray
    };

    try {
      formik.setSubmitting(true);
      await assignHardwareToTechnician(assignData);
      formik.resetForm();
      formik.setStatus({ success: true });
      formik.setSubmitting(false);
      handleAssignSuccess();
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

  const formik = useFormik({
    onSubmit: handleSubmit,
    initialValues: {
      technician: null,
      nrOfHardwares: 1
    },
    validationSchema: Yup.object({
      technician: Yup.object()
        .required('Technician field is required')
        .nullable(),
      // hardware: Yup.array().min(1, 'Hardware field is required').nullable(),
      nrOfHardwares: Yup.number()
        .required('Number of Hardwares field is required')
        .typeError('Must be a number')
    })
  });

  return (
    <>
      {hardwareLoading ? (
        <Box textAlign={'center'}>
          <CircularProgress />
        </Box>
      ) : hardware?.worker_hardware_list.length === 0 ? (
        <Box textAlign={'center'}>
          <Typography variant={'h5'}>No hardware available</Typography>
        </Box>
      ) : (
        <FormikProvider value={formik}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={technicians}
                  getOptionLabel={(option) =>
                    option.first_name + ' ' + option.last_name
                  }
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        {option.first_name + ' ' + option.last_name}
                      </li>
                    );
                  }}
                  value={formik.values.technician}
                  onChange={(event, value) => {
                    formik.setFieldValue('technician', value);
                  }}
                  onBlur={formik.handleBlur}
                  name={'technician'}
                  renderInput={(params) => (
                    <TextField
                      data-cy="technician-field"
                      name={'technician'}
                      error={Boolean(
                        formik.touched.technician && formik.errors.technician
                      )}
                      helperText={
                        formik.touched.technician && formik.errors.technician
                      }
                      fullWidth
                      {...params}
                      label={'Technician'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type={'number'}
                  fullWidth
                  label={'Number of Hardware'}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value < 1) {
                      formik.setFieldValue('nrOfHardwares', 1);
                      return;
                    }
                    if (value > hardware?.worker_hardware_list?.length) {
                      formik.setFieldValue(
                        'nrOfHardwares',
                        hardware?.worker_hardware_list?.length
                      );
                      return;
                    }
                    formik.setFieldValue('nrOfHardwares', value);
                  }}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.touched.nrOfHardwares && formik.errors.nrOfHardwares
                  )}
                  value={formik.values.nrOfHardwares}
                  name="nrOfHardwares"
                  helperText={
                    formik.touched.nrOfHardwares && formik.errors.nrOfHardwares
                  }
                />

                {/* <Autocomplete
                multiple={true}
                options={
                  !hardware?.worker_hardware_list
                    ? []
                    : hardware?.worker_hardware_list
                }
                getOptionLabel={(option) =>
                  option.brand + ' ' + option.model + `(${option.mac_address})`
                }
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {`${option.brand + ' ' + option.model}  (${
                        option.mac_address
                      })`}
                    </li>
                  );
                }}
                value={formik.values.hardware}
                onChange={(event, value) => {
                  formik.setFieldValue('hardware', value);
                  formik.setFieldValue('nrOfHardwares', value.length);
                }}
                onBlur={formik.handleBlur}
                name={'hardware'}
                renderInput={(params) => (
                  <TextField
                    data-cy="hardware-field"
                    name={'hardware'}
                    error={Boolean(
                      formik.touched.hardware && formik.errors.hardware
                    )}
                    helperText={
                      formik.touched.hardware && formik.errors.hardware
                    }
                    fullWidth
                    {...params}
                    label={'Hardware'}
                  />
                )}
              /> */}
              </Grid>

              <Grid item xs={12} align={'center'}>
                <Typography>
                  Number of hardwares that can be assigned:{' '}
                  {hardware?.worker_hardware_list.length}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} align={'center'}>
                <Button variant="contained" type={'submit'}>
                  Assign Hardware
                </Button>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      )}
    </>
  );
}

AssignHardwareForm.propTypes = assignHardwareFormProps;

export default AssignHardwareForm;
