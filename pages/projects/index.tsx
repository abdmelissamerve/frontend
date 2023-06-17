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
    }, [ability]);

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
                        usersList={usersData?.users}
                        projects={data?.projects}
                        getProjectsList={getProjectsList}
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
