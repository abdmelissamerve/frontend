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
import firebase from '@/utils/firebase';

const SSHTerminal = ({ worker, workerId }) => {
  const terminalContainerRef = useRef(null);
  const termRef = useRef(null);
  const sshSocket = useRef<Socket>(null);
  const [connectionStatus, setConnectionStatus] = useState('pending');
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    (async () => {
      const currentUser = firebase.auth().currentUser;
      let token = '';
      if (currentUser) {
        token = await currentUser.getIdToken();
      }
      const socket = io(
        `${process.env.NEXT_PUBLIC_APP_WS_ENDPOINT}/ssh_worker`,
        {
          path: '/ws/socket.io/',
          forceNew: true,
          transports: ['websocket'],
          reconnectionAttempts: 3,
          auth: {
            token: token
          }
        }
      );
      socket.on('connect', () => {
        setConnectionStatus('connected');
        setConnectionError(null);
      });
      socket.on('connect_error', (error) => {
        setConnectionStatus('error');
        setConnectionError(error.message);
      });

      sshSocket.current = socket;
    })();

    return () => {
      termRef.current?.dispose();
      sshSocket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (connectionStatus !== 'connected') {
      return;
    }

    const term = createTerm(terminalContainerRef, { cols: 120, rows: 50 });

    sshSocket.current.on('data', (response) => {
      termRef.current.write(response);
    });
    sshSocket.current.emit('ssh_connect', {
      worker_id: workerId
    });
    term.onData((data) => {
      sshSocket.current.emit('data', data);
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

  return <div id="ssh-terminal-popup" ref={terminalContainerRef}></div>;
};

export default SSHTerminal;
