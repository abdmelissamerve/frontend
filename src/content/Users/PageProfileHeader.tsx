import { FC } from "react";

import { Grid, Typography } from "@mui/material";
import EditButton from "@/content/Users/single/EditProfileModal";
import UpdateButton from "./single/UpdatePassword";

interface Props {
    getProfile: Function;
}

const PageProfileHeader: FC<Props> = ({ getProfile }) => {
    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        Your Profile
                    </Typography>
                    <Typography variant="subtitle2">Manage informations related to your personal details.</Typography>
                </Grid>
                <Grid item>
                    <EditButton getProfile={getProfile} />
                    <UpdateButton />
                </Grid>
            </Grid>
        </>
    );
};

export default PageProfileHeader;
