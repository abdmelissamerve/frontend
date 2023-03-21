import {
  Tooltip,
  Badge,
  TooltipProps,
  tooltipClasses,
  styled,
  useTheme,
  Box
} from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'src/components/Link';
import { useTranslation } from 'react-i18next';

const ImgWrapper = styled('img')(
  ({ theme }) => `
    cursor: pointer;
    width: 50px;
    height: 41px
`
);

const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]
  }
}));

function Logo() {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  // const theme = useTheme();

  return (
    <div>
      <Box
        component={'img'}
        onClick={() => router.push('/')}
        alt="CSML"
        src="/static/images/logo/logo_mobile.webp"
        sx={{
          cursor: 'pointer',
          width: '50px',
          height: '41px',
          display: 'flex',
          alignItems: 'center'
        }}
      />
    </div>
  );
}

export default Logo;
