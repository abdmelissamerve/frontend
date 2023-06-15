import { Authenticated } from "@/components/Authenticated";
import PageHeader from "@/content/Projects/PageHeader";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { AbilityContext } from "@/contexts/Can";
import ExtendedSidebarLayout from "@/layouts/ExtendedSidebarLayout";
import { Grid } from "@mui/material";
import Head from "next/head";
import Results from "@/content/Projects/Results";
import { ChangeEvent, SyntheticEvent, useContext, useEffect, useState } from "react";
import Footer from "@/components/Footer";

import { getProjects } from "@/services/user/projects";
import { getProjects as getAdminProjects } from "@/services/admin/projects";
import { useFetchData } from "@/hooks/useFetch";
import { getUsers } from "@/services/admin/users";

export default function Projects() {
    const ability = useContext(AbilityContext);

    const [filters, setFilters] = useState({
        role: "",
        active: false,
    });
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(25);

    const [query, setQuery] = useState<string>("");
    const { data, loading, error, fetchData } = useFetchData(
        ability.can("manage", "all") ? getAdminProjects : getProjects
    );

    const {
        data: usersData,
        loading: usersLoading,
        error: usersError,
        fetchData: fetchUsersData,
    } = useFetchData(ability.can("manage", "all") ? getUsers : null);

    const getUsersList = (data: any) => {
        fetchUsersData(data);
    };

    const getProjectsList = (data: any) => {
        fetchData(data);
    };

    useEffect(() => {
        getProjectsList({});
        getUsersList({});
    }, [filters, limit, query, page, ability]);

    useEffect(() => {
        if (!data?.length) {
            setPage((prevPage) => Math.max(0, prevPage - 1));
        }
    }, [data]);

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
                <title>Projects</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader getProjectsList={getProjectsList} usersList={usersData?.users} />
            </PageTitleWrapper>
            <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                <Grid item xs={12}>
                    <Results
                        projects={data?.projects}
                        getProjectsList={getProjectsList}
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
        </>
    );
}

Projects.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);
