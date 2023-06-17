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
import { getUsers } from "@/services/admin/users";

import { useFetchData } from "@/hooks/useFetch";

export default function Tasks() {
    const ability = useContext(AbilityContext);
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedProjectName, setSelectedProjectName] = useState("");

    const { data, loading, error, fetchData } = useFetchData(ability.can("manage", "all") ? getAdminTasks : getTasks);
    const {
        data: projectData,
        loading: projectLoading,
        error: projectError,
        fetchData: fetchProjectsData,
    } = useFetchData(ability.can("manage", "all") ? getAdminProjects : getProjects);

    const {
        data: usersData,
        loading: usersLoading,
        error: usersError,
        fetchData: fetchUsersData,
    } = useFetchData(ability.can("manage", "all") ? getUsers : null);

    const getTasksList = (data: any) => {
        fetchData(data);
    };

    const fetchProjectsList = (data: any) => {
        fetchProjectsData(data);
    };

    const fetchUsersList = (data: any) => {
        fetchUsersData(data);
    };

    useEffect(() => {
        if (selectedProjectId) {
            getTasksList({
                projectId: selectedProjectId,
            });
        }
        fetchProjectsList({});
        fetchUsersList({});
    }, [ability, selectedProjectId]);

    useEffect(() => {
        if (projectData) {
            setProjects(projectData.projects);
            if (!selectedProjectId) {
                setSelectedProjectId(projectData?.projects?.[0]?.id);
                setSelectedProjectName(projectData?.projects?.[0]?.name);
            }
        }
    }, [projectData, selectedProjectId, selectedProjectName]);

    const handleProjectChange = (event) => {
        setSelectedProjectName(projectData.projects.find((project) => project.id == event.target.value).name);
        setSelectedProjectId(event.target.value);
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
                    selectedProjectName={selectedProjectName}
                    usersList={usersData}
                />
            </PageTitleWrapper>
            <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                <Grid item xs={12}>
                    <Results
                        tasks={data?.tasks}
                        getTasksList={getTasksList}
                        loading={loading}
                        error={error}
                        selectedProjectId={selectedProjectId}
                        usersList={usersData}
                    />
                </Grid>
            </Grid>
            <Footer />
        </>
    );
}

Tasks.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);
