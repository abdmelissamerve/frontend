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
import { addBlockListOrganisation } from '@/services/blocklist';

import dynamic from 'next/dynamic';

const AddBlocklistForm = dynamic(() => import('./AddBlocklistOrgForm'), {
  ssr: false
});

interface ResultsProps {
  getBlocklists: Function;
  query: any;
  limit: any;
  page: any;
}

const PageHeader: FC<ResultsProps> = ({
  getBlocklists,
  query,
  limit,
  page
}) => {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleAddBlocklistOpen = () => {
    setOpen(true);
  };

  const handleAddBlocklistClose = () => {
    setOpen(false);
  };

  const handleCreateBlocklistSuccess = () => {
    enqueueSnackbar(t('The blocklist organisations was added successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
  };

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      const data = {
        name: _values.name,
        domain: _values.domain
      };
      await addBlockListOrganisation(data);
      await getBlocklists({
        search: query,
        order_by: '',
        skip: limit * page,
        limit: limit
      });
      handleCreateBlocklistSuccess();
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
    } catch (err) {
      console.log(err);
      setStatus({ success: false });
      setErrors({ submit: err.data.detail });
      setSubmitting(false);
    }
  };
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Blocklist organisations')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleAddBlocklistOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Add blocklist organisation')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleAddBlocklistClose}
      >
        <DialogTitle
          sx={{
            p: 2
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Add blocklist organisation')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to add a new blocklist organisation.')}
          </Typography>
        </DialogTitle>
        <AddBlocklistForm
          addBlocklistOrg={handleFormSubmit}
          handleCancel={handleAddBlocklistClose}
        />
      </Dialog>
    </>
  );
};

export default PageHeader;
