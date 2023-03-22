import PropTypes from 'prop-types';

import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import Text from 'src/components/Text';
import { Chart } from 'src/components/Chart';
import FiberManualRecordTwoToneIcon from '@mui/icons-material/FiberManualRecordTwoTone';
import type { ApexOptions } from 'apexcharts';

const chartProps = {
  data: PropTypes.array,
  labels: PropTypes.array,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired
};

type ChartProps = PropTypes.InferProps<typeof chartProps>;

function AreaChart({ data, labels, width, height }: ChartProps) {
  const theme = useTheme();

  const options: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    colors: [theme.colors.warning.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      colors: [theme.colors.warning.main],
      curve: 'smooth',
      width: 3
    },
    legend: {
      show: false
    },
    labels: labels,
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false,
      min: 0
    }
  };

  return (
    <>
      <Card
        sx={{
          overflow: 'visible',
          width: width
        }}
      >
        <CardHeader
          sx={{
            padding: '16px 16px 0 16px'
          }}
          titleTypographyProps={{
            component: 'h5',
            variant: 'caption',
            fontWeight: 'bold'
          }}
          title={'Total installs'}
        />
        <CardContent
          sx={{
            pt: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Text flex color="warning">
            <FiberManualRecordTwoToneIcon />
          </Text>
          <Typography
            sx={{
              px: 1
            }}
            variant="h1"
          >
            56
          </Typography>
        </CardContent>
        <Box sx={{ paddingTop: '38px' }}>
          <Chart options={options} series={data} type="area" height={height} />
        </Box>
      </Card>
    </>
  );
}

AreaChart.propTypes = chartProps;

export default AreaChart;
