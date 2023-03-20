import { FC, useContext, useEffect, useState } from 'react';
import { styled, IconButton, Box, Tooltip } from '@mui/material';
import { ThemeContext } from 'src/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';

const ThemeSettings: FC = () => {
  const { t }: { t: any } = useTranslation();
  const setThemeName = useContext(ThemeContext);

  useEffect(() => {
    const curThemeName =
      window.localStorage.getItem('appTheme') || 'PureLightTheme';
    setTheme(curThemeName);
    setMode(curThemeName === 'PureLightTheme' ? 'light' : 'dark');
  }, []);

  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [theme, setTheme] = useState('PureLightTheme');
  const themeStyles = useTheme();

  const toggleTheme = (): void => {
    setMode((prevMode) => {
      const newTheme =
        prevMode === 'light' ? 'DarkSpacesTheme' : 'PureLightTheme';
      setTheme(newTheme);
      setThemeName(newTheme);

      return prevMode === 'light' ? 'dark' : 'light';
    });
  };

  return (
    <Box>
      <Tooltip arrow title={t('Theme Mode')}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.primary',
            borderRadius: 1
          }}
        >
          <IconButton onClick={toggleTheme} color="inherit">
            {themeStyles.palette.mode === 'dark' ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default ThemeSettings;
