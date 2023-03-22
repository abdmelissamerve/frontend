import { useRef, useState, useCallback, useEffect } from 'react';
import { useAuth } from 'src/hooks/useAuth';

import {
  Avatar,
  Box,
  Button,
  Divider,
  alpha,
  List,
  ListItem,
  ListItemText,
  Popover,
  IconButton,
  Typography,
  styled,
  useTheme,
  Card
} from '@mui/material';
import router, { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { NavigateBefore } from '@mui/icons-material';

function SidebarTopSection() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const { logout, user } = useAuth();

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleRedirectEditPage = async (): Promise<void> => {
    try {
      router.push('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        mx: 2,
        pt: 1,
        position: 'relative'
      }}
      data-cy="sidebar-top-section-box"
    >
      <Avatar
        sx={{
          width: 68,
          height: 68,
          mb: 2,
          mx: 'auto'
        }}
        alt={user?.email}
        src={user?.photo_url}
        data-cy="sidebar-top-section-avatar"
      />

      <Typography
        variant="h4"
        sx={{
          color: `${theme.colors.alpha.trueWhite[100]}`
        }}
        data-cy="sidebar-top-section-name"
      >
        {user?.first_name} {user?.last_name}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: `${theme.colors.alpha.trueWhite[70]}`
        }}
        data-cy="sidebar-top-section-jobtitle"
      >
        {user?.jobtitle}
      </Typography>

      <Button
        data-cy="sidebar-top-section-view-profile"
        onClick={handleRedirectEditPage}
      >
        View your profile
      </Button>
    </Box>
  );
}

export default SidebarTopSection;
