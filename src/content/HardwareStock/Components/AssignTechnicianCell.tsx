import {
  TableCell,
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState, useCallback, useEffect, useContext } from 'react';
import { useFetchData } from '@/hooks/useFetch';
import { getUsers } from '@/services/users';
import { updateWorkerHardware } from '@/services/hardware-stock';
import { useAuth } from '@/hooks/useAuth';
import { useSnackbar, VariantType } from 'notistack';
import { AbilityContext } from '@/contexts/Can';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  deleteObject
} from 'firebase/storage';
import generateReport from './ReportGenerator';

const technicianProps = {
  technician: PropTypes.object,
  hardware: PropTypes.object,
  handleSingleAssignSuccess: PropTypes.func
};

type TechnicianProps = PropTypes.InferProps<typeof technicianProps>;

function AssignTechnicianCell({
  technician,
  hardware,
  handleSingleAssignSuccess
}: TechnicianProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user } = useAuth();
  const { data, loading, error, fetchData } = useFetchData(getUsers);
  const ability = useContext(AbilityContext);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    fetchData({ role: 'technician' });
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleSnackbar = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, {
      variant: variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 2000
    });
  };

  const handleFileUpload = async (name, file, location) => {
    const storage = getStorage();
    const storageRef = ref(storage, `/${location}/${name}`);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const url = await getDownloadURL(uploadTask.ref);
    return url;
  };

  const handleTechnicianChange = async (selectedTechnician) => {
    try {
      const report = await generateReport(hardware, selectedTechnician);
      const url = await handleFileUpload(
        Math.floor(Math.random() * 899999 + 100000),
        report,
        'hardware_reports'
      );
      await updateWorkerHardware(hardware.id, {
        technician_id: selectedTechnician.id,
        report: url
      });
      setAnchorEl(null);
      handleSnackbar('Technician assigned successfully', 'success');
      handleSingleAssignSuccess({});
    } catch (e) {
      console.error(e);
      handleSnackbar('Something went wrong, pleaase try again', 'error');
    }
  };

  if (!ability.can('read', 'Users')) {
    return (
      <TableCell>
        {technician ? (
          <Typography fontWeight={'bold'}>
            {technician?.first_name} {technician?.last_name}
          </Typography>
        ) : (
          <Button
            size={'small'}
            onClick={(e) => {
              e.stopPropagation();
              handleTechnicianChange(user);
            }}
          >
            Assign to Me
          </Button>
        )}
      </TableCell>
    );
  }

  return (
    <>
      <TableCell sx={{ paddingY: '1px' }} align={'center'}>
        {technician ? (
          <Tooltip title={'Assign technician'} placement={'top'} arrow>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              size={'small'}
              sx={{ paddingY: '5px' }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
            >
              <Typography fontWeight={'bold'}>
                {technician?.first_name} {technician?.last_name}
              </Typography>
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title={'Assign technician'} placement={'top'} arrow>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              size={'small'}
              sx={{ paddingY: '5px' }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
            >
              <Typography fontWeight={'bold'}>-</Typography>
            </Button>
          </Tooltip>
        )}

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClick={(e) => e.stopPropagation()}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          <Typography variant={'h5'}>Choose Technician</Typography>
          <Divider sx={{ marginY: '10px' }} />
          {loading ? (
            <MenuItem sx={{ justifyContent: 'center' }}>
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            data?.map((item) => {
              if (item.id === user.id) {
                return null;
              }
              return (
                <MenuItem
                  sx={{
                    borderBottom: '1px solid lightGray',
                    '&:last-child': { borderBottom: 'none' },

                    borderRadius: 0
                  }}
                  onClick={() => handleTechnicianChange(item)}
                  key={item.id}
                >
                  {item.first_name} {item.last_name}
                </MenuItem>
              );
            })
          )}
        </Menu>
      </TableCell>
    </>
  );
}

AssignTechnicianCell.propTypes = technicianProps;

export default AssignTechnicianCell;
