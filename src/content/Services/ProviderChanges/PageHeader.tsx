import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@mui/material';

const PageHeader = () => {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Providers change requests')}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default PageHeader;
