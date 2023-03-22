import { FC, ReactElement, forwardRef, Ref, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TransitionProps } from '@mui/material/transitions';
import {
  Typography,
  Dialog,
  styled,
  Slide,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  deleteProviderLocation,
  getProviderLocations
} from 'src/services/providerLocation';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

interface ResultsProps {
  providersLocation: any;
  provider: any;
  openDialog: boolean;
  closeDialog: Function;
  updateLocationList: Function;
}

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const LocationResults: FC<ResultsProps> = ({
  providersLocation,
  openDialog,
  closeDialog,
  provider,
  updateLocationList
}) => {
  if (providersLocation === null) {
    return null;
  }

  const deleteLocation = async (locationId) => {
    await deleteProviderLocation(provider.id, locationId);
    updateLocationList(provider);
  };

  return (
    <>
      <DialogWrapper
        open={openDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDialog}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> ID </TableCell>
                <TableCell> Continent </TableCell>
                <TableCell> Country </TableCell>
                <TableCell> City </TableCell>
                <TableCell> Data center </TableCell>
                <TableCell> Action </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {providersLocation.map((location) => {
                return (
                  <TableRow hover key={location.id}>
                    <TableCell>
                      <Typography>{location.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">{location.continent}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography noWrap variant="subtitle2">
                          {location.country}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>{location.city}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{location.data_center}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography noWrap>
                        <Tooltip title={'Delete'} arrow>
                          <IconButton
                            onClick={() => deleteLocation(location.id)}
                            color="primary"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogWrapper>
    </>
  );
};

LocationResults.propTypes = {
  providersLocation: PropTypes.array
};

LocationResults.defaultProps = {
  providersLocation: []
};

export default LocationResults;
