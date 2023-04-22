import { Authenticated } from "@/components/Authenticated";
import { AbilityContext } from "@/contexts/Can";
import ExtendedSidebarLayout from "@/layouts/ExtendedSidebarLayout";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useContext } from "react";
import NotAuthorized from "../status/not_authorized";

export default function Reports() {
    const ability = useContext(AbilityContext);

    if (!ability.can("manage", "all")) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Head>
                <title>Reports</title>
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
                <Typography variant="h1">Admin Reports</Typography>
            </Box>
        </>
    );
}

Reports.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);
