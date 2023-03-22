import {
    Box,
    Card,
    Typography,
    Container,
    Divider,
    Button,
    OutlinedInput,
    styled
} from '@mui/material';
import Head from 'next/head';
import type {ReactElement} from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import Link from '../../../src/components/Link';

import {useTranslation} from 'react-i18next';

const MainContent = styled(Box)(
    () => `
    height: 100%;
    width: 100%;
    display: flex;
    flex: 1;
    justify-content: center;
    flex-direction: column;
text-align: center;
align-items: center;
justify-content: center;
`
);

const TopWrapper = styled(Box)(
    ({theme}) => `
  display: flex;
  width: 100%;
  
  flex: 1;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(6)};
`
);

const OutlinedInputWrapper = styled(OutlinedInput)(
    ({theme}) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

const ButtonSearch = styled(Button)(
    ({theme}) => `
    margin-right: -${theme.spacing(1)};
`
);

function NotAuthorized() {
    const {t}: { t: any } = useTranslation();

    return (
        <>
            <Head>
                <title>Status - 404</title>
            </Head>
            <Box sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/*<img alt="404" height={180} src="/static/images/status/404.svg" />*/}
                <Typography variant="h2" sx={{my: 2}}>
                    {t("You do not have access to this page")}
                </Typography>
                <Typography
                    variant="h4"
                    color="text.secondary"
                    fontWeight="normal"
                    sx={{mb: 4}}
                >
                    {t(
                        "Not enough permissions to access this page. Please contact your administrator."
                    )}
                </Typography>
                <Card sx={{textAlign: 'center', mt: 3, p: 4, maxWidth: '400px'}}>
                    <Divider sx={{my: 4}}>OR</Divider>
                    <Link href="/technician/dashboard">
                        <Button variant={'contained'}>
                            {t('Go to technician dashboard')}
                        </Button>
                    </Link>
                </Card>
            </Box>

        </>
    );
}

export default NotAuthorized;

NotAuthorized.getLayout = function getLayout(page: ReactElement) {
    return <BaseLayout>{page}</BaseLayout>;
};
