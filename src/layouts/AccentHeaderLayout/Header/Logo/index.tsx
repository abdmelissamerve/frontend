import { Box, Tooltip, Badge, styled, useTheme } from '@mui/material';
import Link from 'src/components/Link';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.colors.alpha.trueWhite[100]};
        padding: ${theme.spacing(0, 1, 0, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Box)(
  ({ theme }) => `
        width: 52px;
        height: 38px;
        transform: scale(.8);
        transition: ${theme.transitions.create(['transform'])};

        &:hover {
        transform: scale(1);
        }
`
);

const LogoSign = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.trueWhite[70]};
        width: 18px;
        height: 18px;
        border-radius: ${theme.general.borderRadiusSm};
        position: relative;
        transform: rotate(45deg);
        top: 3px;
        left: 17px;

        &:after, 
        &:before {
            content: "";
            display: block;
            width: 18px;
            height: 18px;
            position: absolute;
            top: -1px;
            right: -20px;
            transform: rotate(0deg);
            border-radius: ${theme.general.borderRadiusSm};
        }

        &:before {
            background: ${theme.colors.alpha.trueWhite[50]};
            right: auto;
            left: 0;
            top: 20px;
        }

        &:after {
            background: ${theme.colors.alpha.trueWhite[30]};
        }
`
);

const LogoSignInner = styled(Box)(
  ({ theme }) => `
        width: 16px;
        height: 16px;
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 5;
        border-radius: ${theme.general.borderRadiusSm};
        background: ${theme.header.background};
`
);

function Logo() {
  // const theme = useTheme();

  return (
    <LogoWrapper href="/">
      <LogoSignWrapper>
        <svg
          width="192"
          height="29"
          viewBox="0 0 192 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.8813 5.51317L12.5753 9.6674C12.5069 9.79068 12.5019 9.94023 12.562 10.068L14.0631 13.2594C14.227 13.6078 14.099 14.0261 13.7697 14.218L9.18082 16.8927C8.77442 17.1296 8.43979 17.4757 8.21351 17.8932L2.45786 28.512C2.30065 28.802 2.61698 29.1193 2.89942 28.9549L17.1669 20.6507C17.4834 20.4665 17.8862 20.5687 18.0808 20.8825L18.8805 22.1718C18.9296 22.251 19.0026 22.3119 19.0886 22.3453L24.6898 24.4937C24.967 24.6015 25.2277 24.3023 25.0895 24.0349L15.4464 5.52183C15.3278 5.29225 15.0067 5.28733 14.8813 5.51317Z"
            fill="#FB8122"
          />
          <path
            d="M99.7347 0.61893L102.832 5.55407C102.924 5.70053 103.08 5.79203 103.251 5.79916L108.512 5.78159C108.978 5.80103 109.388 6.18289 109.403 6.65687L109.401 13.4572C109.416 13.9473 109.542 14.4259 109.768 14.8564C109.855 15.023 109.948 15.1868 110.025 15.3585L115.461 27.5297C115.471 27.5513 115.482 27.5726 115.496 27.5914C115.725 27.8924 116.214 27.7237 116.201 27.3295L116.167 6.70347C116.153 6.24816 116.494 5.86222 116.94 5.8278L119.773 5.78423C119.885 5.77554 119.992 5.72996 120.077 5.6543L125.586 0.705825C125.86 0.461721 125.691 0.00185294 125.327 0.00062604L100.069 2.36145e-06C99.7562 -0.00105119 99.5663 0.350638 99.7347 0.61893Z"
            fill="#E1E2E2"
          />
          <path
            d="M14.0463 3.7627L0.637434 27.6538C0.46491 27.962 0.00298837 27.8374 0.00281113 27.4827L1.09942e-07 21.8574C-7.49119e-05 21.7073 0.038246 21.5597 0.111191 21.4292L12.027 0.174719C12.1594 -0.062008 12.4961 -0.0572064 12.6219 0.183202L14.0581 2.928C14.1951 3.18985 14.1906 3.50495 14.0463 3.7627Z"
            fill="#FB8122"
          />
          <path
            d="M39.1986 9.76269H29.2966C29.0721 9.76269 28.8901 9.94465 28.8901 10.1691V22.1846C28.8901 22.409 29.0721 22.591 29.2966 22.591H42.3609C42.5854 22.591 42.7673 22.409 42.7673 22.1846V0.828857"
            stroke="#FB8122"
            strokeWidth="4.55184"
          />
          <path
            d="M85.9731 24.5325V10.1921C85.9731 9.9676 86.1551 9.78564 86.3796 9.78564H95.669C98.1829 9.78564 100.221 11.8236 100.221 14.3375V24.5325"
            stroke="#FB8122"
            strokeWidth="4.55184"
          />
          <path
            d="M50.272 24.5325V10.1921C50.272 9.9676 50.4539 9.78564 50.6784 9.78564H57.0529C59.262 9.78564 61.0529 11.5765 61.0529 13.7856V24.5325"
            stroke="#FB8122"
            strokeWidth="4.55184"
          />
          <path
            d="M61.0869 9.79248H70.5581C70.7826 9.79248 70.9645 9.97444 70.9645 10.1989V24.529"
            stroke="#FB8122"
            strokeWidth="4.55184"
          />
          <path
            d="M78.4688 7.94459V24.5327M78.4688 4.38679V0.877441"
            stroke="#FB8122"
            strokeWidth="4.55184"
          />
          <path
            d="M136.581 9.76318H126.428C125.306 9.76318 124.396 10.673 124.396 11.7953V20.5591C124.396 21.6814 125.306 22.5912 126.428 22.5912H136.581C137.703 22.5912 138.613 21.6814 138.613 20.5591V11.7953C138.613 10.673 137.703 9.76318 136.581 9.76318Z"
            stroke="#E1E2E2"
            strokeWidth="4.55184"
          />
          <path
            d="M157.894 9.76318H147.742C146.619 9.76318 145.709 10.673 145.709 11.7953V20.5591C145.709 21.6814 146.619 22.5912 147.742 22.5912H157.894C159.017 22.5912 159.927 21.6814 159.927 20.5591V11.7953C159.927 10.673 159.017 9.76318 157.894 9.76318Z"
            stroke="#E1E2E2"
            strokeWidth="4.55184"
          />
          <path
            d="M167.227 0.877441V22.1882C167.227 22.4126 167.409 22.5946 167.633 22.5946H172.55"
            stroke="#E1E2E2"
            strokeWidth="4.55184"
          />
          <path
            d="M188.996 9.75732H176.926C176.701 9.75732 176.519 9.93928 176.519 10.1637V14.9653C176.519 15.1898 176.701 15.3717 176.926 15.3717H188.593C188.818 15.3717 189 15.5537 189 15.7782V22.1848C189 22.4092 188.818 22.5912 188.593 22.5912H174.82"
            stroke="#E1E2E2"
            strokeWidth="4.55184"
          />
        </svg>
        {/* <Tooltip
        arrow
        placement="right"
        title="Tokyo NextJS Typescript Admin Dashboard"
      >
        <Badge
          sx={{
            '.MuiBadge-badge': {
              fontSize: theme.typography.pxToRem(11),
              right: -2,
              top: 8,
              background: theme.colors.alpha.black[30],
              color: theme.colors.alpha.trueWhite[100]
            }
          }}
          overlap="circular"
          badgeContent="3.0"
        >
          <LogoSignWrapper>
            <LogoSign>
              <LogoSignInner />
            </LogoSign>
          </LogoSignWrapper>
        </Badge>
      </Tooltip> */}
      </LogoSignWrapper>
    </LogoWrapper>
  );
}

export default Logo;
