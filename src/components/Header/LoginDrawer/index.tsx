import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { loginItems } from '../loginItems';
import { useRouter } from 'next/router';
import { Typography, useTheme, Divider, alpha } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import PropTypes from 'prop-types';
import { useAuth } from 'src/hooks/useAuth';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const loginProps = {
  show: PropTypes.bool,
  handleClick: PropTypes.func
};

type LoginDrawerProps = PropTypes.InferProps<typeof loginProps>;

const LoginDrawer: React.FunctionComponent<LoginDrawerProps> = (props) => {
  const theme = useTheme();
  const router = useRouter();
  const auth = useAuth();

  const handleButtonPress = (path) => {
    props.handleClick();
    router.push(path);
  };
  return (
    <div>
      <React.Fragment key={'left'}>
        <Drawer
          sx={{ zIndex: 99 }}
          hideBackdrop
          anchor={'left'}
          open={props.show}
          PaperProps={{
            sx: {
              display: {
                xs: 'flex',
                md: 'none'
              },
              width: '100%',
              position: 'absolute',
              top: '50px',
              backgroundColor: alpha(theme.header.background, 0.97)
            }
          }}
        >
          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 'calc(100vh - 50px)'
            }}
          >
            <Box
              sx={{ width: '100%', position: 'relative', textAlign: 'center' }}
            >
              {/* <IconButton
                onClick={() => setToggleDrawer(!toggleDrawer)}
                sx={{ position: 'absolute', right: 0, top: 0 }}
              >
                <CloseIcon />
              </IconButton> */}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}
            >
              {!auth.isAuthenticated ? (
                <Typography sx={{ fontSize: '30px', fontWeight: 'bold' }}>
                  Welcome
                </Typography>
              ) : (
                <Typography sx={{ fontSize: '30px', fontWeight: 'bold' }}>
                  {auth.user.name}
                </Typography>
              )}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: 10,
                  marginBottom: 2
                }}
              >
                {!auth.isAuthenticated ? (
                  loginItems.map((item, index) => (
                    <Button
                      onClick={() => handleButtonPress(item.path)}
                      variant={'contained'}
                      sx={{
                        width: '30%',
                        fontSize: '15px'
                      }}
                      key={item.id}
                      startIcon={item.icon}
                    >
                      {item.label}
                    </Button>
                  ))
                ) : (
                  <Button
                    onClick={() => auth.logout()}
                    variant={'contained'}
                    sx={{
                      width: '40%',
                      fontSize: '15px'
                    }}
                    startIcon={<ExitToAppIcon />}
                  >
                    Log out
                  </Button>
                )}
              </Box>
              {/* <Box>
                <Divider />
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    variant={'contained'}
                    sx={{
                      fontSize: '14px',
                      width: '60%'
                    }}
                    startIcon={<KeyIcon />}
                  >
                    Forgot password?
                  </Button>
                </Box>
              </Box> */}
              {!auth.isAuthenticated && (
                <Typography
                  sx={{ fontSize: '17px', fontWeight: 'bold', marginTop: 10 }}
                >
                  Sing in/Register to get access to all of our features
                </Typography>
              )}
            </Box>

            <Box>
              <Divider />
              <Typography
                variant={'body1'}
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',

                  paddingTop: 1
                }}
              >
                Powered by AdminTools
              </Typography>
            </Box>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
};

LoginDrawer.propTypes = loginProps;

export default LoginDrawer;
