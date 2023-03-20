import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

interface PageTitleWrapperProps {
  children?: ReactNode;
}

const PageTitleWrapper: FC<PageTitleWrapperProps> = ({ children }) => {
  return (
    <>
      <Box
        sx={{
          px: {
            xs: 1.5,
            sm: 3,
            lg: 4
          },
          py: 2
        }}
        className="MuiPageTitle-wrapper"
      >
        {children}
      </Box>
    </>
  );
};

PageTitleWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default PageTitleWrapper;
