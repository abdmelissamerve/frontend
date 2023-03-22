import { useState, FC } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Grid,
  Dialog,
  DialogTitle,
  Typography,
  Button,
  Box,
  Divider,
  useTheme
} from '@mui/material';

const PageHeader = () => {
  const { user } = useAuth();
  const date = new Date();
  const theme = useTheme();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item display={'flex'} xs={12} gap={1}>
          <Typography
            data-cy="stock-title"
            variant="h3"
            component="h3"
            gutterBottom
          >
            Welcome,
          </Typography>
          <Typography variant="h3" color={theme.colors.primary.main}>
            {user.first_name} {user.last_name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h4'} color={'gray'}>
            These are your analytics stats for today, {date.getDate()}{' '}
            {date.toLocaleString('default', { month: 'long' })}{' '}
            {date.getFullYear()}
          </Typography>
        </Grid>
        <Grid item>
          {/* <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleAddHardwarenOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            data-cy="add-organisation-button"
          >
            {t('Add Stock')}
          </Button> */}
        </Grid>
      </Grid>
    </>
  );
};

export default PageHeader;
