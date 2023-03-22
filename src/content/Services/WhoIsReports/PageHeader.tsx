import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@mui/material';
interface ResultsProps {
  getWhoIsReports: Function;
  query: any;
  limit: any;
  page: any;
}

const PageHeader: FC<ResultsProps> = () => {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h3" component="h3" gutterBottom>
          {t('WhoIs Public Reports')}
        </Typography>
      </Grid>
    </>
  );
};

export default PageHeader;
