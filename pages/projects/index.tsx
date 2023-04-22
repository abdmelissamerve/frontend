import { Authenticated } from "@/components/Authenticated";
import { AbilityContext } from "@/contexts/Can";
import ExtendedSidebarLayout from "@/layouts/ExtendedSidebarLayout";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useContext } from "react";

export default function Projects() {
    const ability = useContext(AbilityContext);

    return (
        <>
            <Head>
                <title>Projects</title>
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
                    <Typography variant="h1">Admin Projects</Typography>
                ) : ability.can("read", "User-Projects") ? (
                    <Typography variant="h1">User Projects</Typography>
                ) : null}
            </Box>
        </>
    );
}

Projects.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);
