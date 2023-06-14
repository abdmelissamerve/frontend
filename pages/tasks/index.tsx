import { Authenticated } from "@/components/Authenticated";
import PageHeader from "@/content/Tasks/PageHeader";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { AbilityContext } from "@/contexts/Can";
import ExtendedSidebarLayout from "@/layouts/ExtendedSidebarLayout";
import { Grid } from "@mui/material";
import Head from "next/head";
import Results from "@/content/Tasks/Results";
import { ChangeEvent, SyntheticEvent, useContext, useEffect, useState } from "react";
import Footer from "@/components/Footer";

import { getTasks } from "@/services/user/tasks";
import { getTasks as getAdminTasks } from "@/services/admin/tasks";

import { getProjects } from "@/services/user/projects";
import { getProjects as getAdminProjects } from "@/services/admin/projects";

import { useFetchData } from "@/hooks/useFetch";

export default function Tasks() {
    const ability = useContext(AbilityContext);
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");

    const [filters, setFilters] = useState({
        role: "",
        active: false,
    });
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(25);

    const [query, setQuery] = useState<string>("");
    const { data, loading, error, fetchData } = useFetchData(ability.can("manage", "all") ? getAdminTasks : getTasks);
    const {
        data: projectData,
        loading: projectLoading,
        error: projectError,
        fetchData: fetchProjectsData,
    } = useFetchData(ability.can("manage", "all") ? getAdminProjects : getProjects);

    const getTasksList = (data: any) => {
        fetchData(data);
    };

    const fetchProjectsList = (data: any) => {
        fetchProjectsData(data);
    };

    useEffect(() => {
        getTasksList({
            projectId: selectedProjectId,
        });
        fetchProjectsList({});
    }, [filters, limit, query, page, ability, selectedProjectId]);

    useEffect(() => {
        if (projectData && projectData.projects.length > 0) {
            setProjects(projectData.projects);
            if (!selectedProjectId) {
                setSelectedProjectId(projectData.projects[0].id);
            }
        }
    }, [projectData, selectedProjectId]);

    useEffect(() => {
        if (!data?.length) {
            setPage((prevPage) => Math.max(0, prevPage - 1));
        }
    }, [data]);

    useEffect(() => {
        if (!data?.length) {
            setPage((prevPage) => Math.max(0, prevPage - 1));
        }
    }, [data]);

    const handleProjectChange = (event) => {
        setSelectedProjectId(event.target.value);
    };

    const handlePageChange = (_event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const handleQueryChange = (query: string) => {
        setPage(0);
        setQuery(query);
    };

    const handleTabsChange = async (_event: SyntheticEvent, tabsValue: unknown) => {
        let value = null;
        value = tabsValue;
        setPage(0);
        if (value != "all" && value == "active") {
            setFilters((prevFilters) => ({
                ...prevFilters,
                role: "",
                active: true,
            }));
        } else if (value != "all" && value != "active") {
            setFilters((prevFilters) => ({
                ...prevFilters,
                role: value,
                active: false,
            }));
        } else {
            setFilters((prevFilters) => ({
                ...prevFilters,
                role: "",
                active: false,
            }));
        }
    };

    return (
        <>
            <Head>
                <title>Tasks</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader
                    getTasksList={getTasksList}
                    handleProjectChange={handleProjectChange}
                    projects={projects}
                    selectedProjectId={selectedProjectId}
                />
            </PageTitleWrapper>
            <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                <Grid item xs={12}>
                    <Results
                        tasks={data?.tasks}
                        getTasksList={getTasksList}
                        handleTabsChange={handleTabsChange}
                        filters={filters}
                        page={page}
                        limit={limit}
                        handlePageChange={handlePageChange}
                        handleLimitChange={handleLimitChange}
                        query={query}
                        handleQueryChange={handleQueryChange}
                        loading={loading}
                        error={error}
                    />
                </Grid>
            </Grid>
            <Footer />
            {/* <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {ability.can("manage", "all") ? (
                    <Typography variant="h1">Admin Tasks</Typography>
                ) : ability.can("read", "User-Tasks") ? (
                    <Typography variant="h1">User Tasks</Typography>
                ) : null}
            </Box> */}
        </>
    );
}

Tasks.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);
