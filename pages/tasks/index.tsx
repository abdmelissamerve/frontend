import { Authenticated } from "@/components/Authenticated";
import ExtendedSidebarLayout from "@/layouts/ExtendedSidebarLayout";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useContext } from "react";
import { AbilityContext } from "@/contexts/Can";

export default function Tasks() {
    const ability = useContext(AbilityContext);

    return (
        <>
            <Head>
                <title>Tasks</title>
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
                    <Typography variant="h1">Admin Tasks</Typography>
                ) : ability.can("read", "User-Tasks") ? (
                    <Typography variant="h1">User Tasks</Typography>
                ) : null}
            </Box>
        </>
    );
}

Tasks.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);
