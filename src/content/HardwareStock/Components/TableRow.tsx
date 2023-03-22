import {
  TableRow,
  TableCell,
  Box,
  Chip,
  useTheme,
  Typography,
  Paper,
  Button,
  IconButton,
  ClickAwayListener,
  Menu,
  styled,
  MenuProps,
  MenuItem,
  Tooltip
} from '@mui/material';
import PropTypes from 'prop-types';
import Link from '@/components/Link';
import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AssignTechnicianCell from './AssignTechnicianCell';
import { AbilityContext } from '@/contexts/Can';

const rowProps = {
  data: PropTypes.object,
  handleOpenEdit: PropTypes.func,
  handleOpenFinishInstall: PropTypes.func,
  handleOpenDelete: PropTypes.func,
  handleSingleAssignSuccess: PropTypes.func
};

type RowProps = PropTypes.InferProps<typeof rowProps>;

function HardwareTableRow({
  data,
  handleOpenDelete,
  handleOpenEdit,
  handleOpenFinishInstall,
  handleSingleAssignSuccess
}: RowProps) {
  const router = useRouter();
  const theme = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const ability = useContext(AbilityContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>, row) => {
    // setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledMenu = styled((props: MenuProps) => (
    <ClickAwayListener onClickAway={handleClose}>
      <Menu
        hideBackdrop
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        elevation={1}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        {...props}
      />
    </ClickAwayListener>
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,

      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light'
          ? 'rgb(55, 65, 81)'
          : theme.palette.grey[300],

      '& .MuiMenu-list': {
        padding: '4px 0'
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(1.5)
        }
      }
    }
  }));

  return (
    <>
      <TableRow
        onClick={() => {
          router.push({
            pathname: `/hardware-stock/${data.id}`
          });
        }}
        hover
        key={data.id}
        sx={{
          position: 'relative',
          whiteSpace: 'nowrap',
          cursor: 'pointer'
        }}
      >
        {/* BRAND */}
        <TableCell sx={{ paddingY: '12px' }}>{data.brand}</TableCell>

        {/* MODE: */}
        <TableCell>{data.model}</TableCell>

        {/* STATUS */}
        <TableCell align="center">
          <Box>
            <Chip
              size="small"
              sx={{
                backgroundColor:
                  data.worker?.install_status == 'pending'
                    ? theme.colors.warning.main
                    : data.worker?.install_status == 'installed'
                    ? theme.colors.success.main
                    : data.technician
                    ? theme.colors.primary.main
                    : theme.colors.info.main,
                color: theme.palette.common.white,
                fontWeight: 'bold'
              }}
              label={
                data.worker?.install_status == 'pending'
                  ? 'Pending'
                  : data.worker?.install_status == 'installed'
                  ? 'Installed'
                  : data.technician
                  ? 'Assigned'
                  : 'Available'
              }
            />
          </Box>
          {data.worker?.status}
        </TableCell>

        {/* PUBLIC IPV4 */}
        <TableCell>{data.worker?.ipv4}</TableCell>

        {/* PRIVATE IPV4 */}
        <TableCell>{data.worker?.private_ipv4}</TableCell>

        {/* TECHNICIAN */}

        <AssignTechnicianCell
          handleSingleAssignSuccess={handleSingleAssignSuccess}
          technician={data?.technician}
          hardware={data}
        />

        {/* SERIAL NUMBER */}
        <TableCell>{data.serial_number}</TableCell>

        {/* MAC ADDRESS */}
        <TableCell>{data.mac_address}</TableCell>

        {/* ACQUISTION DATE */}
        <TableCell align={'center'}>
          <Typography sx={{ marginRight: 2 }}>
            {data.acquisition_date}
          </Typography>
        </TableCell>

        {/* WARRANTY */}
        <TableCell align={'center'}>{data.warranty_term}</TableCell>

        {/* ACQUISTION PRICE */}
        <TableCell align={'center'}>
          <Typography sx={{ marginRight: 2 }}>
            {data.acquisition_price}$
          </Typography>
        </TableCell>

        {/* ACTIONS MENU  */}
        <ClickAwayListener onClickAway={() => setShowMenu(false)}>
          <TableCell sx={{ paddingLeft: 0 }}>
            {ability.can('manange', 'Hardware-Actions') ? (
              <>
                <Tooltip title={'Actions'} placement={'top'} arrow>
                  <Button
                    sx={{ paddingY: 0, '&:hover': { bgcolor: 'transparent' } }}
                    size="small"
                    id="demo-customized-button"
                    aria-controls={open ? 'demo-customized-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    disableElevation
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClick(event, data);
                    }}
                  >
                    <MoreHorizIcon />
                  </Button>
                </Tooltip>
                <StyledMenu
                  disablePortal={true}
                  id="demo-customized-menu"
                  MenuListProps={{
                    'aria-labelledby': 'demo-customized-button'
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  {data.worker?.install_status == 'pending' ? (
                    <MenuItem onClick={handleClose} disableRipple>
                      <Button
                        fullWidth
                        sx={{ justifyContent: 'left' }}
                        onClick={() => handleOpenFinishInstall(data)}
                        size="small"
                        startIcon={<CheckCircleOutlineIcon />}
                      >
                        <Typography variant={'h5'}>Finish Install</Typography>
                      </Button>
                    </MenuItem>
                  ) : null}

                  <MenuItem onClick={handleClose} disableRipple>
                    <Link
                      href={data.invoice}
                      target={'_blank'}
                      underline={'none'}
                    >
                      <Button
                        fullWidth
                        sx={{ justifyContent: 'left' }}
                        size="small"
                        startIcon={<ReceiptLongIcon />}
                      >
                        <Typography variant={'h5'}>View Invoice</Typography>
                      </Button>
                    </Link>
                  </MenuItem>

                  <MenuItem onClick={handleClose} disableRipple>
                    <Button
                      sx={{ justifyContent: 'left' }}
                      fullWidth
                      onClick={() => {
                        handleOpenEdit(data);
                      }}
                      size="small"
                      startIcon={<LaunchTwoToneIcon />}
                    >
                      <Typography variant={'h5'}>Edit</Typography>
                    </Button>
                  </MenuItem>

                  <MenuItem onClick={handleClose} disableRipple>
                    <Button
                      fullWidth
                      sx={{ justifyContent: 'left' }}
                      onClick={() => handleOpenDelete(data)}
                      color="error"
                      size="small"
                      startIcon={<DeleteTwoToneIcon />}
                    >
                      <Typography variant={'h5'}>Delete</Typography>
                    </Button>
                  </MenuItem>
                </StyledMenu>
              </>
            ) : (
              data.worker?.install_status == 'pending' && (
                <Button
                  fullWidth
                  sx={{ justifyContent: 'left' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFinishInstall(data);
                  }}
                  size="small"
                  startIcon={<CheckCircleOutlineIcon />}
                >
                  <Typography variant={'h5'}>Finish Install</Typography>
                </Button>
              )
            )}
          </TableCell>
        </ClickAwayListener>
      </TableRow>
    </>
  );
}

HardwareTableRow.propTypes = rowProps;

export default HardwareTableRow;
