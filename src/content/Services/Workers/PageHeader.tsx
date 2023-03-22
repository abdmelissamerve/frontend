import { useState, FC, useEffect, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Dialog,
  DialogTitle,
  Collapse,
  Zoom,
  Typography,
  Button,
  CircularProgress,
  Box
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSnackbar } from 'notistack';
import dynamic from 'next/dynamic';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getProviders } from '@/services/providers';
import { useDeployWorkers } from '@/hooks/useDeployWorkers';
import DeployProgress from './DeployProgress';

const AddWorkerForm = dynamic(() => import('./AddWorkerForm'), {
  ssr: false
});

interface ResultsProps {
  getWorkersList(): void;
}

const PageHeader: FC<ResultsProps> = ({ getWorkersList }) => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const deployWorkers = useDeployWorkers();
  const [showDeployLogs, setShowDeployLogs] = useState(false);

  useEffect(() => {
    if (deployWorkers.isSuccessful) {
      enqueueSnackbar(t('The workers were deployed successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        autoHideDuration: 2000
      });
    }
  }, [deployWorkers.isSuccessful]);

  useEffect(() => {
    if (deployWorkers.error) {
      enqueueSnackbar(deployWorkers.error, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        autoHideDuration: 2000
      });
    }
  }, [deployWorkers.error]);

  const handleCreateWorkerOpen = async () => {
    const providersList = await getProviders({
      search: '',
      sort_by: '',
      skip: 0,
      limit: 1000
    });
    setProviders(providersList);
    setOpen(true);
  };

  const handleCreateWorkerClose = (event, reason) => {
    if (reason && reason == 'backdropClick') {
      return;
    }
    getWorkersList({});
    setOpen(false);
  };

  const handleCreateUserSuccess = () => {
    enqueueSnackbar(t('The user account was created successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography
            data-cy="worker-header-title"
            variant="h3"
            component="h3"
            gutterBottom
          >
            {t('Workers')}
          </Typography>
          <Typography data-cy="worker-header-subtitle" variant="subtitle2">
            {t(
              'Test the latency of your server from all over the world with this benchmark tool. '
            )}
          </Typography>
        </Grid>
        <Grid item>
          {deployWorkers.isDeploying ? (
            <Button
              sx={{
                mx: 2
              }}
              variant="outlined"
            >
              <CircularProgress size="1.5rem" />
            </Button>
          ) : (
            <Button
              sx={{
                mx: 2
              }}
              color="info"
              onClick={() => deployWorkers.deploy()}
              variant="contained"
              data-cy="deploy-workers-button"
            >
              {t('Deploy all workers')}
            </Button>
          )}

          <Button
            onClick={handleCreateWorkerOpen}
            variant="contained"
            color="primary"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            data-cy="add-worker-button"
          >
            {t('Add worker')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        disableEscapeKeyDown
        open={open}
        onClose={handleCreateWorkerClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCreateWorkerClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom>
            {t('Add a new worker')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'Fill in the fields below to create and add a new worker to the site'
            )}
          </Typography>
        </DialogTitle>
        <AddWorkerForm
          onClose={handleCreateWorkerClose}
          providers={providers}
        />
      </Dialog>
      <DeployProgress {...deployWorkers} />
    </>
  );
};

export default PageHeader;
