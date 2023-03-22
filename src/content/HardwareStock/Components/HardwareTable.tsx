import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Box,
  TextField,
  InputAdornment,
  Typography,
  TableSortLabel,
  CircularProgress
} from '@mui/material';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import BulkActions from '@/content/Services/Workers/BulkActions';
import { useRef, useState } from 'react';

const HardwareTableRow = dynamic(() => import('./TableRow'), {
  ssr: false
});

const tableProps = {
  data: PropTypes.array,
  orderBy: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  createSortHandler: PropTypes.func,
  handleQueryChange: PropTypes.func,
  handlePageChange: PropTypes.func,
  handleLimitChange: PropTypes.func,
  handleOpenDelete: PropTypes.func,
  query: PropTypes.string,
  page: PropTypes.number,
  limit: PropTypes.number,
  count: PropTypes.number,
  handleOpenEdit: PropTypes.func,
  handleOpenFinishInstall: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  selectedStat: PropTypes.string,
  handleSingleAssignSuccess: PropTypes.func
};

type TableProps = PropTypes.InferProps<typeof tableProps>;

function HardwareTable({
  data,
  orderBy,
  handleQueryChange,
  query,
  count,
  handlePageChange,
  handleLimitChange,
  page,
  limit,
  createSortHandler,
  handleOpenEdit,
  handleOpenFinishInstall,
  loading,
  error,
  handleOpenDelete,
  handleSingleAssignSuccess
}: TableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const selectedBulkActions = selectedItems.length > 0;
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const headCells = [
    {
      id: 'brand',
      label: 'Brand',
      width: '150px',
      align: 'left'
    },
    {
      id: 'model',
      label: 'Model',
      width: '150px',
      align: 'left'
    },
    {
      id: 'install_status',
      label: 'Status',
      width: '100px',
      align: 'center'
    },
    {
      id: 'ipv4',
      label: 'IPV4',
      width: '100px',
      align: 'center'
    },
    {
      id: 'private_ipv4',
      label: 'Private IP',
      width: '100px',
      align: 'center'
    },
    {
      id: 'technician',
      label: 'Technician',
      width: '130px',
      align: 'center'
    },

    {
      id: 'serial_number',
      label: 'Serial Number',
      width: '150px',
      align: 'left'
    },
    {
      id: 'mac_address',
      label: 'MAC Address',
      width: '150px',
      align: 'left'
    },
    {
      id: 'acquisition_date',
      label: 'Acquisition Date',
      width: '100px',
      align: 'center'
    },
    {
      id: 'warranty_termin',
      label: 'Warranty Period (days)',
      width: '80px',
      align: 'center'
    },
    {
      id: 'acquisition_price',
      label: 'Acquisition Price',
      width: '100px',
      align: 'center'
    },
    {
      id: 'actions',
      label: '',
      width: '50px',
      align: 'center'
    }
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(
      () => handleQueryChange(event.target.value),
      500
    );
  };

  return (
    <>
      {
        <>
          <Box paddingY={2}>
            {!selectedBulkActions && (
              <TextField
                sx={{
                  px: 2
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleSearch}
                placeholder={'Search by brand, MAC Address or others...'}
                size="small"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
            {selectedBulkActions && <BulkActions />}
          </Box>
          {data?.length == 0 ? (
            <>
              <Typography
                sx={{
                  py: 10
                }}
                variant="h3"
                fontWeight="normal"
                color="text.secondary"
                align="center"
              >
                There is no data mathing your search criteria.
              </Typography>
            </>
          ) : (
            <>
              <TableContainer
                sx={{
                  '&::-webkit-scrollbar': {
                    width: 0
                  }
                }}
              >
                <Table
                  size={'small'}
                  sx={{
                    width: '100%',
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(235, 235, 235, 0.5)',
                      width: '100vw',
                      height: '100%',
                      display: loading ? 'flex' : 'none',
                      justifyContent: 'center',
                      alignItems: 'center'
                      // opacity: 0.2
                    }}
                  >
                    <CircularProgress />
                  </Box>

                  <TableHead>
                    <TableRow>
                      {headCells.map((headCell) => (
                        <TableCell
                          whiteSpace="nowrap"
                          align={headCell.align}
                          // width={headCell.width}
                          key={headCell.id}
                          sortDirection={
                            orderBy === headCell.id ? 'asc' : false
                          }
                        >
                          {headCell.id == 'brand' ||
                          headCell.id == 'technician' ||
                          headCell.id == 'model' ||
                          headCell.id == 'mac_address' ||
                          headCell.id == 'acquisition_date' ||
                          headCell.id == 'warrany_term' ||
                          headCell.id == 'acquisition_price' ? (
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={
                                orderBy === headCell.id ? 'asc' : 'desc'
                              }
                              onClick={() => createSortHandler(headCell.id)}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: '13px',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {headCell.label}
                              </Typography>
                            </TableSortLabel>
                          ) : (
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '13px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {headCell.label}
                            </Typography>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.map((item) => (
                      <>
                        <HardwareTableRow
                          data={item}
                          handleOpenDelete={handleOpenDelete}
                          handleOpenEdit={handleOpenEdit}
                          handleOpenFinishInstall={handleOpenFinishInstall}
                          handleSingleAssignSuccess={handleSingleAssignSuccess}
                        />
                      </>
                    ))}

                    {/* PAGINATION */}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ p: 2 }}>
                <TablePagination
                  component="div"
                  count={count}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                />
              </Box>
            </>
          )}
        </>
      }
    </>
  );
}

HardwareTable.propTypes = tableProps;

// HardwareTable.defaultProps = {
//     count: 5,
//
// }

export default HardwareTable;
