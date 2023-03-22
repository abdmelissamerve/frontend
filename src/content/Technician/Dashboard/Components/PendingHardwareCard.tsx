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

function PendingHardwareCard() {
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
          <Typography variant="h4">Installation</Typography>
          <Typography
            variant="subtitle2"
            fontWeight={'bold'}
            // sx={{
            //   fontSize: `${theme.typography.pxToRem(12)}`
            // }}
          >
            Hardwares that need to be installed
          </Typography>
        </Box>
        <LabelWrapper color="yellow">{t('Pending')}</LabelWrapper>
      </Box>
      <List disablePadding>
        {items.map((item) => (
          <Fragment key={item.id}>
            <Divider />
            <ListItem
              sx={{
                minHeight: '80px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-evenly',
                py: 2,
                pl: 2.5,
                pr: 2
              }}
            >
              <ListItemText
                disableTypography
                primary={
                  <Box display={'flex'} gap={1}>
                    <Typography color="text.primary" variant="h5">
                      {item.name}
                    </Typography>
                    <Typography>{item.jobtitle}</Typography>
                  </Box>
                }
                secondary={
                  <Box display={'flex'} gap={'4px'}>
                    <Typography noWrap variant="subtitle2">
                      {item.avatar},
                    </Typography>

                    <Typography noWrap variant="subtitle2">
                      {item.value}
                    </Typography>
                  </Box>
                }
              />

              {/* <ListItemText
                disableTypography
                primary={
                  <Typography color="text.primary" variant="h5">
                    {item.value}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography noWrap variant="subtitle2" display="flex">
                      {item.avatar}
                    </Typography>
                  </>
                }
              /> */}

              <Button
                variant="contained"
                color="success"
                sx={{
                  paddingX: '10px',
                  paddingY: '3px',
                  fontWeight: 'normal'
                  // '&:hover': {
                  //   backgroundColor: `${theme.colors.primary.main}`,
                  //   color: `${theme.palette.getContrastText(
                  //     theme.colors.primary.main
                  //   )}`
                  // }
                }}
              >
                Start Install
              </Button>
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

export default PendingHardwareCard;
