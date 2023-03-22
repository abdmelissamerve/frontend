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

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { sendInvitation } from '@/services/organisations';
const InviteMemberForm = dynamic(() => import('./InviteMemberForm'), {
  ssr: false
});

interface ResultsProps {
  getMembers: Function;
  query: any;
  limit: any;
  page: any;
  filters: any;
}

const PageHeader: FC<ResultsProps> = ({
  getMembers,
  query,
  limit,
  page,
  filters
}) => {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAddOrganisationOpen = () => {
    setOpen(true);
  };

  const handleAddOrganisationClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = async (_values) => {
    try {
      await sendInvitation({
        email: _values.email,
        role: _values.role,
        organisation_id: router.query.organisationId
      });
      await getMembers({
        search: query,
        order_by: '',
        skip: limit * page,
        limit: limit,
        type: filters.type
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t(
              `Organisation > #${router.query.organisationId} ${router.query.name} > Members`
            )}
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
            data-cy="add-members-button"
          >
            {t('Invite member')}
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
            {t('Invite member')}
          </Typography>
          <Typography
            data-cy="add-organisation-form-subtitle"
            variant="subtitle2"
          >
            {t('Fill in the fields below to send an invitation.')}
          </Typography>
        </DialogTitle>
        <InviteMemberForm
          handleCancel={handleAddOrganisationClose}
          inviteMember={handleFormSubmit}
        />
      </Dialog>
    </>
  );
};

export default PageHeader;
