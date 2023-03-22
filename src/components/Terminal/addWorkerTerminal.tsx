import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Dialog
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { createTerm } from '@/hooks/useTerminal';
import { io, Socket } from 'socket.io-client';
import { useSnackbar } from 'notistack';
import firebase from '@/utils/firebase';

const REACT_APP_WS_ENDPOINT = 'https://api-stg.admintools.dev';
// const REACT_APP_WS_ENDPOINT = 'http://localhost';

const AddWorkerTerminal = ({ worker, workerId }) => {
  const terminalContainerRef = useRef(null);
  const termRef = useRef(null);
  const socket = useRef<Socket>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [connectionStatus, setConnectionStatus] = useState('pending');
  const [connectionError, setConnectionError] = useState(null);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const currentUser = firebase.auth().currentUser;
      let token = '';
      if (currentUser) {
        token = await currentUser.getIdToken();
      }
      const s = io(`${REACT_APP_WS_ENDPOINT}/install_worker`, {
        path: '/ws/socket.io/',
        forceNew: true,
        transports: ['websocket'],
        reconnectionAttempts: 3,
        auth: {
          token: token
        }
      });
      s.on('connect', () => {
        setConnectionStatus('connected');
        setConnectionError(null);
      });
      s.on('connect_error', (error) => {
        setConnectionStatus('error');
        setConnectionError(error.message);
      });

      socket.current = s;
    })();

    return () => {
      termRef.current?.dispose();
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (connectionStatus !== 'connected') {
      return;
    }

    const term = createTerm(terminalContainerRef, { rows: 50 });
    const s = socket.current;

    s.on('install_success', () => {
      setInstallSuccess(true);
    });

    s.on('save_success', () => {
      handleCancel();
      enqueueSnackbar(t('The worker was created successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    });

    s.on('worker_exists_error', (data) => {
      enqueueSnackbar(data.error, {
        variant: 'error',
        persist: true,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    });

    s.on('save_error', (data) => {
      enqueueSnackbar(data.error, {
        variant: 'error',
        persist: true,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    });

    s.on('install_not_ready', () => {
      enqueueSnackbar(t('Install not ready. Please wait...'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    });

    s.emit('run_install', {
      hostname: formData.ipv4,
      username: formData.username,
      password: formData.password,
      port: formData.port
    });

    term.onData((data) => {
      s.emit('data', data);
    });

    s.on('data', (response) => {
      termRef.current.write(response);
    });

    s.emit('ssh_connect', {
      worker_id: workerId
    });
    term.onData((data) => {
      s.emit('data', data);
    });

    termRef.current = term;
  }, [connectionStatus]);

  if (connectionStatus === 'error') {
    return (
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Typography variant="h4">Cannot connect</Typography>
        <Typography color="red" sx={{ mt: 1 }} variant="h6">
          Error: {connectionError}
        </Typography>
      </div>
    );
  }

  if (!workerId || connectionStatus !== 'connected') return null;

  return <div id="install-worker-terminal" ref={terminalContainerRef}></div>;
};

export default AddWorkerTerminal;
