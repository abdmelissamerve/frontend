import React, { FC, ChangeEvent, useRef, useState, useEffect } from 'react';
import {
  Box,
  Card,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  TableSortLabel,
  Link
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { format } from 'date-fns';

interface ResultsProps {
  blocklistsReports: any;
  page: any;
  limit: any;
  handlePageChange: Function;
  handleLimitChange(event: ChangeEvent<HTMLInputElement>);
  handleQueryChange: Function;
  createSortHandler: Function;
  orderBy: any;
  loading: boolean;
  error: any;
}
const Results: FC<ResultsProps> = ({
  blocklistsReports,
  handleQueryChange,
  page,
  limit,
  handlePageChange,
  handleLimitChange,
  createSortHandler,
  orderBy,
  loading,
  error
}) => {
  const { t }: { t: any } = useTranslation();
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  interface Data {
    id: string;
    uuid: string;
    created_at: string;
    domain: string;
    report: string;
    total_blacklisted: number;
  }

  interface HeadCell {
    id: keyof Data;
    label: string;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: 'id',
      label: 'Id'
    },
    {
      id: 'uuid',
      label: 'Uuid'
    },
    {
      id: 'created_at',
      label: 'Created at'
    },
    {
      id: 'domain',
      label: 'Domain'
    },
    {
      id: 'report',
      label: 'Report'
    },
    {
      id: 'total_blacklisted',
      label: 'Total blacklisted'
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

  if (error) {
    return (
      <Typography
        sx={{
          py: 10
        }}
        variant="h3"
        fontWeight="normal"
        color="text.secondary"
        align="center"
      >
        An error has occurred, please try again later.
      </Typography>
    );
  }

  return (
    <>
      <Card>
        <Box p={2}>
          <TextField
            sx={{
              m: 0
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              )
            }}
            onChange={handleSearch}
            placeholder={t('Search by uuid or domain...')}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>
        <Divider />
        {blocklistsReports?.length === 0 ? (
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
              {loading
                ? 'Loading...'
                : 'There is no data mathing your search criteria.'}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? 'asc' : false}
                      >
                        {headCell.id !== 'report' ? (
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? 'asc' : 'desc'}
                            onClick={() => createSortHandler(headCell.id)}
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            {headCell.label}
                          </TableSortLabel>
                        ) : (
                          <Typography align="left">{headCell.label}</Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blocklistsReports?.map((blocklistReport) => {
                    return (
                      <TableRow hover key={blocklistReport.uuid}>
                        <TableCell>
                          <Typography variant="h5">
                            {blocklistReport.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5">
                            {blocklistReport.uuid}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5">
                            {format(
                              new Date(blocklistReport.created_at),
                              'dd.MM.yyyy HH:mm:ss'
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography>{blocklistReport.domain}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Link href="#" variant="h5"></Link>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5">
                            {blocklistReport.total_blacklisted}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={-1}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[25, 50, 100]}
              />
            </Box>
          </>
        )}
      </Card>
    </>
  );
};

export default Results;
