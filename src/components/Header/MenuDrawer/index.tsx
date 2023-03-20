import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { menuItems } from '../menuItems';
import { useTheme, Typography, alpha, Link } from '@mui/material';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import ThemeSettings from '@/components/ThemeSettings';

const menuProps = {
  show: PropTypes.bool,
  handleClick: PropTypes.func
};

type MenuDrawerProps = PropTypes.InferProps<typeof menuProps>;

const MenuDrawer: React.FunctionComponent<MenuDrawerProps> = (props) => {
  const theme = useTheme();
  const router = useRouter();

  const handleButtonPress = (path) => {
    props.handleClick();
    router.push(path);
  };

  return (
    <div>
      <React.Fragment key={'right'}>
        <Drawer
          sx={{ zIndex: 99 }}
          hideBackdrop
          anchor={'right'}
          open={props.show}
          // onClose={() => setToggleDrawer(!toggleDrawer)}
          PaperProps={{
            sx: {
              display: {
                xs: 'flex',
                md: 'none'
              },
              width: '100%',
              position: 'absolute',
              bottom: 0,
              backgroundColor: alpha(theme.header.background, 0.97)
            }
          }}
        >
          <Box
            sx={{
              padding: 0,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              position: 'relative'
            }}
          >
            <Box>
              {Object.keys(menuItems).map((key, index) => (
                <List
                  key={key}
                  sx={{ padding: 0, mt: index === 0 ? 0 : 2 }}
                  subheader={
                    <ListSubheader
                      sx={{
                        color: theme.colors.primary.main,
                        backgroundColor: 'transparent',
                        display: 'block',
                        borderRadius: 1,
                        paddingX: 1
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Typography>
                      </Box>
                    </ListSubheader>
                  }
                >
                  <ListItem sx={{ paddingTop: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        alignItems: 'center'
                      }}
                    >
                      <Box>
                        {menuItems[key].map((subItem) =>
                          subItem.id !== 'blacklist' ? (
                            <ListItemButton
                              onClick={() => handleButtonPress(subItem.path)}
                              key={subItem.id}
                              sx={{ paddingX: 0, marginTop: 1 }}
                            >
                              <ListItemIcon sx={{ minWidth: '35px' }}>
                                {subItem.icon}
                              </ListItemIcon>
                              <ListItemText
                                primaryTypographyProps={{
                                  sx: {
                                    fontSize: '20px'
                                  }
                                }}
                                primary={subItem.label}
                              />
                            </ListItemButton>
                          ) : (
                            <ListItemButton
                              key={subItem.id}
                              sx={{
                                paddingX: 0,
                                marginTop: 1,
                                position: 'relative'
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: '35px' }}>
                                {subItem.icon}
                              </ListItemIcon>
                              <ListItemText
                                primaryTypographyProps={{
                                  sx: {
                                    fontSize: '20px'
                                  }
                                }}
                                secondaryTypographyProps={{
                                  sx: {
                                    position: 'absolute',
                                    fontSize: '10px',
                                    top: 5,
                                    right: -40,
                                    zIndex: 999,
                                    border: `1px solid ${theme.header.background}`,
                                    backgroundColor: theme.colors.primary.main,
                                    paddingX: 1,
                                    rotate: '15deg'
                                  }
                                }}
                                primary={subItem.label}
                                secondary={'Coming soon'}
                              />
                            </ListItemButton>
                          )
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                </List>
              ))}
              <Box sx={{ mt: 3 }}>
                <ThemeSettings />
              </Box>
            </Box>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
};

MenuDrawer.propTypes = menuProps;

export default MenuDrawer;
