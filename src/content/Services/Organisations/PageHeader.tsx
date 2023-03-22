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
import { addOrganisation } from '@/services/organisations';
import dynamic from 'next/dynamic';

const AddOrganisationForm = dynamic(() => import('./AddOrganisationForm'), {
  ssr: false
});

interface ResultsProps {
  getOrganisations: Function;
  query: any;
  limit: any;
  page: any;
}

const PageHeader: FC<ResultsProps> = ({
  getOrganisations,
  query,
  limit,
  page
}) => {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleAddOrganisationOpen = () => {
    setOpen(true);
  };

  const handleAddOrganisationClose = () => {
    setOpen(false);
  };

  const handleCreateOrganisationsSuccess = () => {
    enqueueSnackbar(t('The organisation was added successfully'), {
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

  const handleFormSubmit = async (_values) => {
    try {
      const data = {
        name: _values.name,
        website: _values.website,
        logo_url: _values.logo_url,
        email: _values.email,
        role: _values.role
      };
      await addOrganisation(data);
      handleCreateOrganisationsSuccess();
      await getOrganisations({
        search: query,
        order_by: '',
        skip: limit * page,
        limit: limit
      });
    } catch (err) {
      console.log(err);
      setErrMessage(err?.data?.detail);
    }
  };
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography
            data-cy="organisation-title"
            variant="h3"
            component="h3"
            gutterBottom
          >
            {t('Organisations')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleAddOrganisationOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            data-cy="add-organisation-button"
          >
            {t('Add organisation')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleAddOrganisationClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography
            data-cy="add-organisation-form-title"
            variant="h4"
            gutterBottom
          >
            {t('Add organisation')}
          </Typography>
          <Typography
            data-cy="add-organisation-form-subtitle"
            variant="subtitle2"
          >
            {t('Fill in the fields below to add a new organisation.')}
          </Typography>
        </DialogTitle>
        <AddOrganisationForm
          addOrganisation={handleFormSubmit}
          handleCancel={handleAddOrganisationClose}
          errMessage={errMessage}
        />
      </Dialog>
    </>
  );
};

export default PageHeader;
