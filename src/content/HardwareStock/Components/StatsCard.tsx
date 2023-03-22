import { Box, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import { useState } from 'react';

const statsProps = {
  title: PropTypes.string,
  value: PropTypes.number,
  description: PropTypes.string,
  selectedStat: PropTypes.string,
  handleChangeStat: PropTypes.func
  //   secondValue: PropTypes.string
};

type StatsProps = PropTypes.InferProps<typeof statsProps>;

function StatsCard({
  title,
  description,
  value,
  selectedStat,
  handleChangeStat
}: StatsProps) {
  const theme = useTheme();

  return (
    <>
      <Paper
        onClick={() => handleChangeStat(title)}
        sx={{
          cursor: 'pointer',
          backgroundColor:
            selectedStat === title ? theme.palette.primary.main : '',
          color:
            selectedStat === title ? theme.palette.secondary.contrastText : '',
          transform: selectedStat === title ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.2s ease-in-out',
          py: 1,
          px: 2,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.secondary.contrastText,
            transform: 'scale(1.05)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
        <Box>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="h6">{description}</Typography>
        </Box>
        <Box sx={{ marginTop: 1 }}>
          <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
      </Paper>
    </>
  );
}

StatsCard.propTypes = statsProps;

export default StatsCard;
