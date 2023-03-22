import PropTypes from 'prop-types';

import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  useTheme,
  Box
} from '@mui/material';
import Text from 'src/components/Text';
import { Chart } from 'src/components/Chart';
import type { ApexOptions } from 'apexcharts';
import FiberManualRecordTwoToneIcon from '@mui/icons-material/FiberManualRecordTwoTone';

const chartProps = {
  data: PropTypes.array,
  labels: PropTypes.array,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired
};

type ChartProps = PropTypes.InferProps<typeof chartProps>;

function BarChart({ data, labels, width, height }: ChartProps) {
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
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '60%'
      }
    },
    colors: [theme.colors.primary.dark, theme.colors.info.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
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
          title={'Last 10 days'}
        />
        <CardContent
          sx={{
            pt: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Text flex color={'primary'}>
            <FiberManualRecordTwoToneIcon />
          </Text>
          <Typography
            sx={{
              px: 1
            }}
            variant="h1"
          >
            4
          </Typography>
        </CardContent>
        <Box sx={{ paddingTop: '38px' }}>
          <Chart options={options} series={data} type="bar" height={height} />
        </Box>
      </Card>
    </>
  );
}

BarChart.propTypes = chartProps;

export default BarChart;
