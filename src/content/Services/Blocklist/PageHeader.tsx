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
import { addBlockList } from '@/services/blocklist';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const AddBlocklistForm = dynamic(
  () => import('../BlocklistOrganisation/AddBlocklistForm'),
  {
    ssr: false
  }
);

interface ResultsProps {
  getBlocklists: Function;
  limit: any;
  page: any;
}

const PageHeader: FC<ResultsProps> = ({ getBlocklists, page, limit }) => {
  const router = useRouter();
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
    enqueueSnackbar(t('The blocklist was added successfully'), {
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

  const handleFormSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      if(_values.responseArray.length === 0) {
        setStatus({ success: false });
        setErrors({ submit: 'You must have at least one response code' });
        setSubmitting(false);
        return
      }
      const uniqueValues = new Set(_values.responseArray.map(v => v.code));
      if(uniqueValues.size !== _values.responseArray.length){
        setStatus({ success: false });
        setErrors({ submit: 'Cannot have duplicate codes in your response list' });
        setSubmitting(false);
        return
      }
      const data = {
        domain: _values.domain,
        description: _values.description,
        response: {
          responses: _values.responseArray
        },
        delist_url: _values.delist_url,
        ipv4: _values.ipv4,
        ipv6: _values.ipv6,
        dom: _values.dom,
        asn: _values.asn
      };
      await addBlockList(data, router.query.organisationId);
      await getBlocklists({
        search: '',
        order_by: '',
        skip: page * limit,
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
            {t(
              `Blocklist Organisations > #${router.query.organisationId} ${router.query.name} > Blocklists`
            )}
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
            {t('Add new blocklist')}
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
            {t('Add blocklist')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to add a new blocklist.')}
          </Typography>
        </DialogTitle>
        <AddBlocklistForm
          addBlocklist={handleFormSubmit}
          handleCancel={handleAddBlocklistClose}
        />
      </Dialog>
    </>
  );
};

export default PageHeader;
