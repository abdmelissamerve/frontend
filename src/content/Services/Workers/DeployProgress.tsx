import { useEffect, useState, useRef } from 'react';
import { Collapse, Typography, Grid, Box, Button } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import moment from 'moment';

interface DeployProgressProps {
  isDeploying: boolean;
  progress: number;
  progressPercentage: number;
  successCount: number;
  failureCount: number;
  workerCount: number;
  startTime: Date;
  retryFailed: any;
  deployResponse: any[];
}

function DeployProgress({
  isDeploying,
  progress,
  progressPercentage,
  successCount,
  failureCount,
  workerCount,
  startTime,
  retryFailed,
  deployResponse
}: DeployProgressProps) {
  const [timer, setTimer] = useState(null);
  const interval = useRef(null);

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    if (!isDeploying) {
      return;
    }
    setTimer(null);
    interval.current = setInterval(() => {
      if (startTime) {
        const startTimestamp = moment(startTime);
        const diff = moment() - startTimestamp;
        timer = moment.utc(diff).format('HH:mm:ss');
        setTimer(timer);
      }
    }, 1000);

    return () => {
      clearInterval(interval.current);
    };
  }, [startTime, isDeploying]);

  const renderProgress = () => {
    if (isDeploying || progress > 0) {
      return (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography>
              Deploying Workers... ({timer ? timer : '...'})
            </Typography>
            <Box>
              <span>
                Success: <span style={{ color: 'green' }}>{successCount}</span>
              </span>
              {' / '}
              <span>
                Failures: <span style={{ color: 'red' }}>{failureCount}</span>
              </span>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography>
                {progress}/{workerCount}
              </Typography>
            </Box>
          </Box>
        </Box>
      );
    }

    return null;
  };

  const renderLog = (items: any[]) => {
    return (
      <pre
        style={{
          width: '100%',
          backgroundColor: 'black',
          color: 'white',
          height: '300px',
          overflow: 'scroll',
          padding: '4px',
          marginTop: '8px',
          marginBottom: 0,
          borderRadius: '10px'
        }}
      >
        {items.map((res) => {
          let log = `#${res.worker.id}\t${res.worker.ipv4}\t\t - ${res.status}`;
          if (res.status !== 'OK') {
            log = `${log}\n#${res.worker.id}\t${res.worker.ipv4}\t\t - ${res.log}`;
          }
          return `${log}\n`;
        })}
      </pre>
    );
  };

  return (
    <>
      {renderProgress()}
      <Collapse
        sx={{ mt: 2 }}
        in={deployResponse.length > 0}
        timeout="auto"
        unmountOnExit
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography>Success Logs</Typography>
            {renderLog(
              deployResponse.filter((res) => res.status === 'OK').reverse()
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Error Logs</Typography>
            {renderLog(
              deployResponse.filter((res) => res.status !== 'OK').reverse()
            )}
          </Grid>
        </Grid>
      </Collapse>
      <Box sx={{ textAlign: 'right' }}>
        {failureCount > 0 && !isDeploying && (
          <Button
            sx={{
              mt: 2
            }}
            size="small"
            variant="contained"
            color="info"
            onClick={retryFailed}
            type="button"
          >
            Retry Failed Workers
          </Button>
        )}
      </Box>
    </>
  );
}

export default DeployProgress;
