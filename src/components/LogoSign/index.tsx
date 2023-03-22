import {
  Box,
  Tooltip,
  Badge,
  TooltipProps,
  tooltipClasses,
  styled,
  useTheme
} from '@mui/material';
import Link from 'src/components/Link';
import { useTranslation } from 'react-i18next';

const LogoWrapper = styled('div')(
  () => `
    text-align: center;
  `
);

const LogoLink = styled(Link)(
  ({ theme }) => `
    color: ${theme.palette.text.primary};
    text-decoration: none;
    display: inline-block;
    font-weight: ${theme.typography.fontWeightBold};
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
  const theme = useTheme();

  return (
    <TooltipWrapper title={t('AdminTools')} arrow>
      <LogoWrapper>
        <LogoLink href="/">
          <img src="/static/images/logo/logo.svg" />
        </LogoLink>
      </LogoWrapper>
    </TooltipWrapper>
  );
}

export default Logo;
