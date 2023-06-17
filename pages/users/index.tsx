import { useEffect, useCallback, useContext } from "react";

import Head from "next/head";

import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";

import PageHeader from "@/content/Users/PageHeader";
import Footer from "src/components/Footer";

import { Grid } from "@mui/material";
import { useRefMounted } from "src/hooks/useRefMounted";

import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/Users/Results";
import { getUsers } from "@/services/admin/users";
import { useFetchData } from "@/hooks/useFetch";
import { AbilityContext } from "@/contexts/Can";
import NotAuthorized from "../status/not_authorized";



function ManagementUsers() {
    const isMountedRef = useRefMounted();

    const { data, loading, error, fetchData } = useFetchData(getUsers);

    const ability = useContext(AbilityContext);

    const getUsersList = useCallback(
        (data: any) => {
            fetchData({});
        },
        [isMountedRef]
    );

    useEffect(() => {
        getUsersList({});
    }, []);

    if (!ability.can("manage", "all")) {
        return <NotAuthorized />;
    }

    return (
        <>
            <Head>
                <title>Users - Management</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader getUsersList={getUsersList} />
            </PageTitleWrapper>
            <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                <Grid item xs={12}>
                    <Results users={data?.users} getUsersList={getUsersList} loading={loading} error={error} />
                </Grid>
            </Grid>
            <Footer />
        </>
    );
}

ManagementUsers.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default ManagementUsers;
