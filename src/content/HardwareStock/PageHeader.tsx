import { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Dialog,
  DialogTitle,
  Zoom,
  Typography,
  Button,
  Box,
  Divider
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSnackbar } from 'notistack';
import AddHardwareForm from '@/content/HardwareStock/Components/AddHardwareForm';
import PropTypes from 'prop-types';
// interface ResultsProps {
//     getOrganisations: Function;
//     query: any;
//     limit: any;
//     page: any;
// }

const headerProps = {
  getHardware: PropTypes.func
};

type HeaderProps = PropTypes.InferProps<typeof headerProps>;

const PageHeader = ({ getHardware }: HeaderProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  // const [errMessage, setErrMessage] = useState('');

  const handleAddHardwarenOpen = () => {
    setOpen(true);
  };
  //
  const handleAddHardwareClose = () => {
    setOpen(false);
  };
  //
  const handleHardwareAdded = () => {
    enqueueSnackbar(t('Hardware was added successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom,
      autoHideDuration: 2000
    });
    getHardware({});
    setOpen(false);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography
            data-cy="stock-title"
            variant="h3"
            component="h3"
            gutterBottom
          >
            {t('Hardware Stock')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleAddHardwarenOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            data-cy="add-organisation-button"
          >
            {t('Add Stock')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleAddHardwareClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography data-cy="add-stck-form-title" variant="h4" gutterBottom>
            {t('Add Hardware')}
          </Typography>
          <Typography data-cy="add-stock-form-subtitle" variant="subtitle2">
            {t('Fill in the fields below to add new Hardware.')}
          </Typography>
        </DialogTitle>
        <Divider />
        <Box sx={{ p: 3 }}>
          <AddHardwareForm handleHardwerAdded={handleHardwareAdded} />
        </Box>
      </Dialog>
    </>
  );
};

PageHeader.propTypes = headerProps;

export default PageHeader;
