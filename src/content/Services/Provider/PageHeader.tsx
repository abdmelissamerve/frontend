import { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Dialog,
  DialogTitle,
  Zoom,
  Typography,
  Button
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSnackbar } from 'notistack';

import { addProvider } from '@/services/providers';
import dynamic from 'next/dynamic';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  deleteObject
} from 'firebase/storage';

const ProviderForm = dynamic(() => import('./AddProviderForm'), {
  ssr: false
});

interface ResultsProps {
  getProvidersList: Function;
  limit: any;
  page: any;
  orderBy: any;
}

const PageHeader: FC<ResultsProps> = ({
  getProvidersList,
  page,
  limit,
  orderBy
}) => {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [percent, setPercent] = useState(0);
  const [path, setPath] = useState('');
  const [url, setUrl] = useState('');

  const handleAddProviderOpen = () => {
    setOpen(true);
  };

  const handleAddProviderClose = () => {
    setOpen(false);
  };

  const handleCreateProviderSuccess = () => {
    enqueueSnackbar(t('The provider was added successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom,
      autoHideDuration: 2000
    });

    setOpen(false);
  };

  const submitProvider = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const data = {
        name: _values.name,
        site: _values.website,
        login_link: _values.loginUrl,
        affiliate_link: _values.affiliateUrl,
        description: _values.description,
        services: _values.services,
        logo: url,
        password: _values.password,
        page_published: _values.published.value,
        statistics: {
          statistics: _values.statistics
        }
      };
      await addProvider(data);
      await getProvidersList({
        search: '',
        sortBy: orderBy,
        skip: page * limit,
        limit: limit
      });
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
      handleCreateProviderSuccess();
      setOpen(false);
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const handleFileUpload = (name, file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `/logo/${name}`);
    setPath(`/logo/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUrl(url);
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
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Providers')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'Test the latency of your server from all over the world with this benchmark tool. '
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleAddProviderOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Add provider')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleAddProviderClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Add a new provider')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'Fill in the fields below to create and add a new provider to the site'
            )}
          </Typography>
        </DialogTitle>
        <ProviderForm
          addProvider={submitProvider}
          handleCancel={handleAddProviderClose}
          handleFileDelete={handleFileDelete}
          handleFileUpload={handleFileUpload}
          path={path}
        />
      </Dialog>
    </>
  );
};

export default PageHeader;
