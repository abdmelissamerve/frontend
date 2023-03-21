import {
  Button,
  Box,
  useTheme,
  IconButton,
  Paper,
  styled,
  Popover,
  Typography,
  MenuItem,
  MenuList,
  Divider,
  Stack,
  ListItemText
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import HeaderUserBox from '@/components/Header/Userbox';
import { useAuth } from 'src/hooks/useAuth';
import ThemeSettings from '@/components/ThemeSettings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoIcon from '@mui/icons-material/Info';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import CookieIcon from '@mui/icons-material/Cookie';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import BlockIcon from '@mui/icons-material/Block';
import Logo from '@/components/LogoSign';
import { useState, useRef } from 'react';

const MenuListWrapperSecondary = styled(MenuList)(
  ({ theme }) => `
  padding: ${theme.spacing(2)};

  & .MuiMenuItem-root {
      border-radius: 50px;
      padding: ${theme.spacing(1, 1, 1, 2.5)};
      min-width: 200px;
      margin-bottom: 2px;
      position: relative;
      color: ${theme.colors.alpha.black[70]};
      &.Mui-selected,
      &:hover,
      &.MuiButtonBase-root:active {
          background: ${theme.colors.alpha.black[10]};
          color: ${theme.colors.alpha.black[100]};
      }
      &:last-child {
          margin-bottom: 0;
      }
    }
`
);

function DesktopHeader() {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const auth = useAuth();

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Paper elevation={3}>
        <Box
          sx={{
            px: {
              xs: 0,
              md: 1.5
            },
            py: {
              xs: 0,
              md: 1
            }
          }}
        >
          <Box
            display="flex"
            alignItems={{ xs: 'start', md: 'center' }}
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            boxShadow={5}
          >
            {isOpen ? (
              <IconButton
                onClick={() => handleClose()}
                sx={{ paddingY: 0, paddingX: 0, minWidth: '40px' }}
              >
                <ExpandLessIcon
                  sx={{
                    fontSize: '40px'
                  }}
                />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => handleOpen()}
                sx={{ paddingY: 0, paddingX: 0, minWidth: '40px' }}
              >
                <ExpandMoreIcon
                  sx={{
                    fontSize: '40px'
                  }}
                />
              </IconButton>
            )}
            <Logo />
            <Box
              mt={{ xs: 3, md: 0 }}
              display={{ xs: 'none', md: 'flex' }}
              alignItems="center"
            >
              <ThemeSettings />
              {/* <Button variant={'contained'} size={'small'}>
                {t('Claim')}
              </Button> */}
              {auth.isAuthenticated ? (
                <HeaderUserBox />
              ) : (
                <Button
                  sx={{ ml: 1 }}
                  onClick={() => router.push('/login')}
                  variant="contained"
                  size={'small'}
                >
                  {t('Sign in')}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        sx={{
          '.MuiPopover-paper': {
            background: theme.header.background,
            marginTop: 8,
            marginLeft: 2.5
          }
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="stretch"
          alignItems="stretch"
          spacing={0}
        >
          <MenuListWrapperSecondary disablePadding>
            <Typography
              noWrap
              variant="h4"
              paddingLeft={2.5}
              paddingBottom={1}
              fontWeight={'bold'}
            >
              {t('Tools')}
            </Typography>
            <Divider />
            <MenuItem
              selected={router.pathname === '/' ? true : false}
              onClick={() => {
                handleClose();
                router.push('/');
              }}
              sx={{ marginTop: 1 }}
            >
              <NetworkWifiIcon
                sx={{
                  color: `${theme.colors.primary.main}`,
                  marginRight: 1
                }}
              />
              <ListItemText
                primaryTypographyProps={{
                  variant: 'h5',
                  marginTop: 0.5
                }}
                primary={t('First')}
              />
            </MenuItem>
            <MenuItem>
              <BlockIcon
                sx={{
                  color: `${theme.colors.primary.main}`,
                  marginRight: 1
                }}
              />
              <ListItemText
                primaryTypographyProps={{
                  variant: 'h5',
                  marginTop: 0.5
                }}
                primary={t('Second')}
              />
            </MenuItem>
          </MenuListWrapperSecondary>
        
        </Stack>
      </Popover>
    </>
  );
}

export default DesktopHeader;
