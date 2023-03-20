import {
  Box,
  alpha,
  lighten,
  styled,
  useTheme,
  Button,
  IconButton
} from '@mui/material';
import LoginDrawer from '../LoginDrawer';
import MenuDrawer from '../MenuDrawer';
import Logo from '@/components/LogoSign';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';

function MobileHeader() {
  const theme = useTheme();
  const [toggleMenuDrawer, setToggleMenuDrawer] = useState(false);
  const [toggleLoginDrawer, setToggleLoginDrawer] = useState(false);

  const handleLoginDrawerItemClick = () => {
    setToggleLoginDrawer(!toggleLoginDrawer);
  };

  const handleMenuDrawerItemClick = () => {
    setToggleMenuDrawer(!toggleMenuDrawer);
  };

  return (
    <Box
      sx={{
        height: '50px',
        color: theme.header.textColor,
        // padding: ${theme.spacing(0, 2)},
        right: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: alpha(theme.header.background, 0.97),
        backdropFilter: 'blur(3px)',
        position: 'sticky',
        top: 0,
        justifyContent: 'space-between',
        width: '100%'
      }}
      alignItems="center"
      display={'flex'}
    >
      <Box
        component={'div'}
        sx={{
          borderBottom: '.5px solid ',
          borderColor: theme.colors.header.dark
        }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        height="50px"
      >
        {/* LOGIN DRAWER */}
        <Box>
          <IconButton
            sx={{
              position: 'relative',
              paddingY: 0,
              paddingX: 1,
              minWidth: '40px'
            }}
            onClick={() => {
              if (!toggleLoginDrawer && !toggleMenuDrawer) {
                setToggleLoginDrawer(true);
              } else if (toggleMenuDrawer) {
                setToggleMenuDrawer(false);
                setToggleLoginDrawer(true);
              } else if (toggleLoginDrawer) {
                setToggleLoginDrawer(false);
              }
            }}
          >
            {toggleLoginDrawer ? (
              <PersonIcon
                sx={{
                  fontSize: '40px',
                  // color: theme.colors.header.dark
                  color: theme.colors.primary.main
                }}
              />
            ) : (
              <PersonOutlineIcon
                sx={{
                  fontSize: '40px',
                  // color: theme.colors.header.dark
                  color: theme.colors.alpha.black[100]
                }}
              />
            )}
          </IconButton>
          <LoginDrawer
            show={toggleLoginDrawer}
            handleClick={handleLoginDrawerItemClick}
          />
        </Box>

        {/* LOGO */}
        <Logo />

        {/* MENU DRAWER */}
        <Box>
          <IconButton
            sx={{
              position: 'relative',
              paddingY: 0,
              paddingX: 0.5,
              minWidth: '40px'
            }}
            onClick={() => {
              if (!toggleLoginDrawer && !toggleMenuDrawer) {
                setToggleMenuDrawer(true);
              } else if (toggleLoginDrawer) {
                setToggleLoginDrawer(false);
                setToggleMenuDrawer(true);
              } else if (toggleMenuDrawer) {
                setToggleMenuDrawer(false);
              }
            }}
          >
            {toggleMenuDrawer ? (
              <LastPageIcon
                sx={{
                  fontSize: '40px',
                  // color: theme.colors.header.dark
                  color: theme.colors.primary.main
                }}
              />
            ) : (
              <FirstPageIcon
                sx={{
                  fontSize: '40px',
                  // color: theme.colors.header.dark
                  color: theme.colors.alpha.black[100]
                }}
              />
            )}
          </IconButton>
          <MenuDrawer
            show={toggleMenuDrawer}
            handleClick={handleMenuDrawerItemClick}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default MobileHeader;
