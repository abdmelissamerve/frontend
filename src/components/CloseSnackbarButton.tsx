import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';

export function closeSnackbarButton(snackbarId) {
  const { closeSnackbar } = useSnackbar();

  return (
    <>
      <button
        style={{
          backgroundColor: 'transparent',
          border: 0,
          color: 'white',
          cursor: 'pointer'
        }}
        onClick={() => {
          closeSnackbar(snackbarId);
        }}
      >
        <CloseIcon />
      </button>
    </>
  );
}
