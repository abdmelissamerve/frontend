import { Box, Button } from '@mui/material';
import Link from 'src/components/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackButton() {
  return (
    <Box>
      <Link href="/" rel="noopener noreferrer">
        <Button>
          <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} /> Back to home page
        </Button>
      </Link>
    </Box>
  );
}

export default BackButton;
