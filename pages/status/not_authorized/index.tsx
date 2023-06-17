import { Box, Typography, Button } from "@mui/material";
import Head from "next/head";
import type { ReactElement } from "react";
import BaseLayout from "src/layouts/BaseLayout";
import Link from "../../../src/components/Link";

function NotAuthorized() {
    return (
        <>
            <Head>
                <title>Status - 404</title>
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
                <Typography variant="h2" sx={{ my: 2 }}>
                    "You do not have access to this page"
                </Typography>
                <Typography variant="h4" color="text.secondary" fontWeight="normal" sx={{ mb: 4 }}>
                    "Not enough permissions to access this page. Please contact your administrator."
                </Typography>

                <Link href="/dashboard">
                    <Button variant={"contained"}>"Go to your dashboard"</Button>
                </Link>
            </Box>
        </>
    );
}

export default NotAuthorized;

NotAuthorized.getLayout = function getLayout(page: ReactElement) {
    return <BaseLayout>{page}</BaseLayout>;
};
