import { forwardRef } from 'react';
import { Grid, Typography, Collapse, Buttom } from '@mui/material';

const TerminalWindow = forwardRef(({ show }, ref) => {
  const { terminal } = ref;

  if (show === false) {
    return null;
  }

  return (
    <Grid>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ alignItems: 'center', fontSize: '1.5rem' }}>MTR</div>
      </div>
      <div ref={terminal}></div>
    </Grid>
  );
});

export default TerminalWindow;
