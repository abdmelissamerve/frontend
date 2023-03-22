import { Fragment } from 'react';

import {
  Box,
  ListItemAvatar,
  ListItemText,
  Divider,
  List,
  Card,
  alpha,
  Button,
  LinearProgress,
  Typography,
  Avatar,
  styled,
  ListItem,
  useTheme,
  linearProgressClasses
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import Link from 'src/components/Link';

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.warning.main};
    color: ${theme.palette.getContrastText(theme.colors.secondary.main)};
    font-size: ${theme.typography.pxToRem(11)};
    font-weight: bold;
    text-transform: uppercase;
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(0.5, 1.5, 0.3)};
  `
);

const LinearProgressPrimary = styled(LinearProgress)(
  ({ theme }) => `
        height: 8px;
        border-radius: ${theme.general.borderRadiusLg};

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha(theme.colors.primary.main, 0.1)};
        }
        
        & .${linearProgressClasses.bar} {
            border-radius: ${theme.general.borderRadiusLg};
            background-color: ${theme.colors.primary.main};
        }
    `
);

function PendingReportCard() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const items = [
    {
      id: 1,
      name: 'Apple iMac 27"',
      jobtitle: 'S/N: 1234567890',
      company: 'MAC: 12:30:50:f1:2a:3b',
      avatar: 'Strada 2',
      value: 'Medgidia, Constanta'
    },
    {
      id: 2,
      name: 'Apple MacBook Pro 13"',
      jobtitle: 'S/N: 1234567890',
      company: 'MAC: 12:30:50:f1:2a:3b',
      avatar: 'Strada Unu',
      value: 'Agigea, Constanta'
    },
    {
      id: 3,
      name: 'Apple Mac Air 13"',
      jobtitle: 'S/N: 1234567890',
      company: 'MAC: 12:30:50:f1:2a:3b',
      avatar: 'I.C.Bratianu',
      value: 'Constanta, Constanta'
    },
    {
      id: 4,
      name: 'Apple MacBook Pro 13"',
      jobtitle: 'S/N: 1234567890',
      company: 'MAC: 12:30:50:f1:2a:3b',
      avatar: 'Strada Unu',
      value: 'Agigea, Constanta'
    },
    {
      id: 5,
      name: 'Apple MacBook Pro 13"',
      jobtitle: 'S/N: 1234567890',
      company: 'MAC: 12:30:50:f1:2a:3b',
      avatar: 'Strada Unu',
      value: 'Agigea, Constanta'
    },
    {
      id: 6,
      name: 'Apple MacBook Pro 13"',
      jobtitle: 'S/N: 1234567890',
      company: 'MAC: 12:30:50:f1:2a:3b',
      avatar: 'Strada Unu',
      value: 'Agigea, Constanta'
    }
  ];

  return (
    <Card>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          background: `${theme.colors.alpha.black[5]}`
        }}
        paddingY={2}
        paddingLeft={2.5}
        paddingRight={2}
      >
        <Box>
          <Typography variant="h4">Summary</Typography>
          <Typography
            variant="subtitle2"
            fontWeight={'bold'}
            // sx={{
            //   fontSize: `${theme.typography.pxToRem(12)}`
            // }}
          >
            You are responsible for these hardwares
          </Typography>
        </Box>
        {/* <LabelWrapper color="secondary">{t('Pending')}</LabelWrapper> */}
      </Box>
      <List disablePadding>
        {items.map((item) => (
          <Fragment key={item.id}>
            <Divider />
            <ListItem
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                display: { xs: 'block', sm: 'flex' },
                py: 1,

                pr: 2
              }}
            >
              <ListItemText
                sx={{
                  flex: 1
                }}
                disableTypography
                primary={
                  <Typography color="text.primary" variant="h5">
                    {item.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography noWrap variant="subtitle2">
                      {item.jobtitle}
                    </Typography>
                  </>
                }
              />
              <Box pl={0.5} display="flex">
                <Button
                  variant={'text'}
                  color="primary"
                  size="small"
                  sx={{
                    paddingX: '10px',
                    paddingY: '3px',
                    alignSelf: 'center',
                    fontWeight: 'normal',
                    backgroundColor: `${theme.colors.primary.lighter}`,
                    '&:hover': {
                      backgroundColor: `${theme.colors.primary.main}`,
                      color: `${theme.palette.getContrastText(
                        theme.colors.primary.main
                      )}`
                    }
                  }}
                >
                  View
                </Button>
              </Box>
            </ListItem>
          </Fragment>
        ))}
      </List>
      <Box
        display="flex"
        justifyContent={'flex-end'}
        sx={{
          background: `${theme.colors.alpha.black[5]}`
        }}
        paddingY={2}
        paddingRight={2}
      >
        <Button size="small" variant={'contained'}>
          <Link href="#" underline="none" sx={{ color: 'white' }}>
            View all
          </Link>
        </Button>
      </Box>
    </Card>
  );
}

export default PendingReportCard;
