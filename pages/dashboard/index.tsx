import { Authenticated } from "@/components/Authenticated";
import { AbilityContext } from "@/contexts/Can";
import ExtendedSidebarLayout from "@/layouts/ExtendedSidebarLayout";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useContext } from "react";

export default function Dashboard() {
    const ability = useContext(AbilityContext);
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {ability.can("manage", "all") ? (
                    <Typography variant="h1">Admin Dashboard</Typography>
                ) : ability.can("read", "User-Dashboard") ? (
                    <Typography variant="h1">User Dashboard</Typography>
                ) : null}
            </Box>
        </>
    );
}

Dashboard.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);
