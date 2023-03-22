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
import {
  sendInvitation,
  getOrganisationMembers
} from '@/services/organisations';
import { addService, getOrganisationServices } from '@/services/services';

import dynamic from 'next/dynamic';

const AddMemberForm = dynamic(() => import('./AddMemberForm'), {
  ssr: false
});
const AddServiceForm = dynamic(() => import('./AddServiceForm'), {
  ssr: false
});

interface ResultsProps {
  organisation: any;
}

const PageHeader: FC<ResultsProps> = ({ organisation }) => {
  const { t }: { t: any } = useTranslation();
  const [openService, setOpenService] = useState(false);
  const [openMember, setOpenMember] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleAddMemberOpen = () => {
    setOpenMember(true);
  };

  const handleAddMemberClose = () => {
    setOpenMember(false);
  };

  const handleAddServiceOpen = () => {
    setOpenService(true);
  };

  const handleAddServiceClose = () => {
    setOpenService(false);
  };
  const handleAddMembersSuccess = () => {
    enqueueSnackbar(t('The member was added successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpenMember(false);
  };

  const handleAddServicesSuccess = () => {
    enqueueSnackbar(t('The service was added successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    setOpenService(false);
    location.reload();
  };

  const handleServiceFormSubmit = async (_values) => {
    try {
      const data = {
        name: _values.name,
        type: _values.type,
        organisation_id: organisation.id
      };
      await addService(organisation.id, data);
      handleAddServicesSuccess();
      await getOrganisationServices(organisation.id, {});
    } catch (err) {
      console.log(err);
    }
  };

  const handleMemberFormSubmit = async (_values) => {
    try {
      const data = {
        email: _values.email,
        role: _values.role,
        organisation_id: organisation.id
      };
      await sendInvitation(data);
      handleAddMembersSuccess();
      await getOrganisationMembers(organisation.id, {
        order_by: ''
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <Typography
            data-cy="my-organisation-title"
            variant="h3"
            component="h3"
            gutterBottom
          >
            {organisation.name} {t('Organisation')}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            onClick={handleAddMemberOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            data-cy="add-member-button"
          >
            {t('Add member')}
          </Button>
        </Grid>

        <Grid item xs={2}>
          <Button
            onClick={handleAddServiceOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            data-cy="add-service-button"
          >
            {t('Add service')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={openMember}
        onClose={handleAddMemberClose}
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
            {t('Add member')}
          </Typography>
          <Typography
            data-cy="add-organisation-form-subtitle"
            variant="subtitle2"
          >
            {t('Fill in the fields below to add a new member.')}
          </Typography>
        </DialogTitle>
        <AddMemberForm
          sendInvitation={handleMemberFormSubmit}
          handleCancel={handleAddMemberClose}
        />
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="md"
        open={openService}
        onClose={handleAddServiceClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography
            data-cy="add-services-form-title"
            variant="h4"
            gutterBottom
          >
            {t('Add service')}
          </Typography>
          <Typography data-cy="add-service-form-subtitle" variant="subtitle2">
            {t('Fill in the fields below to add a new service.')}
          </Typography>
        </DialogTitle>
        <AddServiceForm
          addService={handleServiceFormSubmit}
          handleCancel={handleAddServiceClose}
        />
      </Dialog>
    </>
  );
};

export default PageHeader;
