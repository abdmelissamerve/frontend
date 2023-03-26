import { FC, ReactNode, useContext } from 'react';
import { Box, alpha, lighten, useTheme, Button } from '@mui/material';
import PropTypes from 'prop-types';

import Sidebar from './Sidebar';
import { SidebarContext } from 'src/contexts/SidebarContext';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

interface ExtendedSidebarLayoutProps {
  children?: ReactNode;
}

const ExtendedSidebarLayout: FC<ExtendedSidebarLayoutProps> = ({
  children
}) => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          flex: 1,
          height: '100%',

          '.MuiPageTitle-wrapper': {
            background:
              theme.palette.mode === 'dark'
                ? theme.colors.alpha.trueWhite[5]
                : theme.colors.alpha.white[50],
            marginBottom: `${theme.spacing(4)}`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 1px 0 ' +
                  alpha(lighten(theme.colors.primary.main, 0.7), 0.15) +
                  ', 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)'
                : '0px 2px 4px -3px ' +
                  alpha(theme.colors.alpha.black[100], 0.1) +
                  ', 0px 5px 12px -4px ' +
                  alpha(theme.colors.alpha.black[100], 0.05)
          }
        }}
      >
        {/*<Header />*/}
        <Sidebar />

        <Button
          sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              transform: 'scale(1.1)'
            },
            position: 'absolute',
            zIndex: 999,
            display: {
              xs: 'inline-block',
              lg: 'none'
            },
            paddingLeft: 0
          }}
          onClick={toggleSidebar}
          color="primary"
          aria-label="add"
        >
          <KeyboardDoubleArrowRightIcon
            sx={{ width: '30px', height: '30px' }}
          />
        </Button>
        <Box
          sx={{
            position: 'relative',
            zIndex: 5,
            display: 'block',
            flex: 1,
            // pt: `${theme.header.height}`,
            [theme.breakpoints.up('lg')]: {
              ml: `${theme.sidebar.width}`
            }
          }}
        >
          <Box display="block">{children}</Box>
        </Box>
      </Box>
    </>
  );
};

ExtendedSidebarLayout.propTypes = {
  children: PropTypes.node
};

export default ExtendedSidebarLayout;