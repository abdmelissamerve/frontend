import {
    Box,
    Card,
    Divider,
    IconButton,
    InputAdornment,
    styled,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";

const TabsWrapper = styled(Tabs)(
    ({ theme }) => `
    @media (max-width: ${theme.breakpoints.values.md}px) {
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          box-shadow: none;
      }
    }
    `
);

const Results = ({
    projects,
    getProjectsList,
    filters,
    handleTabsChange,
    page,
    limit,
    handleLimitChange,
    handlePageChange,
    handleQueryChange,
    query,
    loading,
    error,
}) => {
    const { t }: { t: any } = useTranslation();
    interface Data {
        id: number;
        name: string;
        description: string;
        status: string;
        dueDate: string;
    }

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    type Order = "asc" | "desc";

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key
    ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
        return order === "desc"
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    interface HeadCell {
        id: keyof Data;
        label: string;
        align: string;
    }

    interface HeadCell {
        id: keyof Data;
        label: string;
        align: string;
    }

    const headCells: readonly HeadCell[] = [
        {
            id: "id",
            label: "ID",
            align: "center",
        },
        {
            id: "name",
            label: "Name",
            align: "left",
        },
        {
            id: "description",
            label: "Description",
            align: "left",
        },
        {
            id: "status",
            label: "Status",
            align: "left",
        },
        {
            id: "dueDate",
            label: "Due Date",
            align: "left",
        },
        {
            id: "actions",
            label: "Actions",
            align: "center",
        },
    ];

    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<keyof Data>("id");

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        handleRequestSort(event, property);
    };

    return (
        <>
            <Card>
                <Box p={2}>
                    <TextField
                        sx={{
                            m: 0,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchTwoToneIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={() => {}}
                        placeholder={t("Search by name")}
                        size="small"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </Box>

                <Divider />

                {!projects?.length ? (
                    <>
                        <Typography
                            sx={{
                                py: 10,
                            }}
                            variant="h3"
                            fontWeight="normal"
                            color="text.secondary"
                            align="center"
                        >
                            {loading ? "Loading..." : "There is no data mathing your search criteria."}
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
                                                align={headCell.align}
                                                key={headCell.id}
                                                sortDirection={orderBy === headCell.id ? order : false}
                                            >
                                                {headCell.id == "name" ||
                                                headCell.id == "description" ||
                                                headCell.id == "status" ||
                                                headCell.id == "dueDate" ||
                                                headCell.id == "id" ? (
                                                    <span style={{ position: "relative" }}>
                                                        <span style={{ position: "relative" }}>{headCell.label}</span>
                                                        <TableSortLabel
                                                            active={orderBy === headCell.id}
                                                            direction={orderBy === headCell.id ? order : "asc"}
                                                            onClick={createSortHandler(headCell.id)}
                                                            sx={{
                                                                whiteSpace: "nowrap",
                                                                position: "absolute",
                                                                bottom: 0,
                                                            }}
                                                        />
                                                    </span>
                                                ) : (
                                                    <Typography>{headCell.label}</Typography>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projects?.sort(getComparator(order, orderBy)).map((project) => {
                                        return (
                                            <TableRow key={project.id}>
                                                <TableCell align={"center"}>
                                                    <Typography>{project.id}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{project.name}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{project.description}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{project.status}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{project.dueDate}</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography noWrap>
                                                        <Tooltip title={t("Edit")} arrow>
                                                            <IconButton
                                                                onClick={() => {}}
                                                                color="primary"
                                                                size="small"
                                                                color="primary"
                                                            >
                                                                <LaunchTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={t("Delete")} arrow>
                                                            <IconButton onClick={() => {}} color="primary">
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
                        <Box p={2}>
                            <TablePagination
                                component="div"
                                count={-1}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleLimitChange}
                                page={page}
                                rowsPerPage={limit}
                                rowsPerPageOptions={[5, 15, 30]}
                            />
                        </Box>
                    </>
                )}
            </Card>
        </>
    );
};

export default Results;
