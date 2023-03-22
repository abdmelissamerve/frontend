import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  LinearProgress,
  useTheme,
  styled,
  alpha,
  linearProgressClasses,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  Dialog,
  IconButton,
  DialogTitle
} from '@mui/material';
import dynamic from 'next/dynamic';
import { AbilityContext } from '@/contexts/Can';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InfoIcon from '@mui/icons-material/Info';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ArticleIcon from '@mui/icons-material/Article';
import EditHardwareForm from '@/content/HardwareStock/Components/EditHardwareForm';
import AssignHardwareForm from '@/content/HardwareStock/Components/AssignHardwareForm';
import { useSnackbar, VariantType } from 'notistack';
import Link from '@/components/Link';
import { getProviders } from '@/services/providers';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
const InstallWorker = dynamic(() => import('../Components/InstallWorkerForm'), {
  ssr: false
});

const hardwareProps = {
  data: PropTypes.object,
  handleEditSuccess: PropTypes.func
};

type HardwareProps = PropTypes.InferProps<typeof hardwareProps>;

function HardwareContent({ data, handleEditSuccess }: HardwareProps) {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [openFinishInstall, setOpenFinishInstall] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [providers, setProviders] = useState([]);
  const ability = useContext(AbilityContext);

  const handleOpenEdit = () => {
    // setHardwareData(data);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleOpenAssign = () => {
    setOpenAssign(true);
  };

  const handleCloseAssign = () => {
    setOpenAssign(false);
  };

  const handleSnackbar = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, {
      variant: variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 2000
    });
  };

  const handleSuccessEdit = () => {
    setOpenEdit(false);
    handleEditSuccess(parseInt(router.query.hardwareId));
    handleSnackbar('Hardware updated successfully', 'success');
  };

  const handleAssignSuccess = () => {
    setOpenAssign(false);
    // handleHardwareUpdated({});
    handleSnackbar('Hardware assigned successfully', 'success');
  };

  const LinearProgress1 = styled(LinearProgress)(
    ({ theme }) => `
          border-radius: ${theme.general.borderRadiusSm};
          width: 100%;
          &.${linearProgressClasses.colorPrimary} {
              height: 26px;
              background-color: ${alpha(theme.colors.success.main, 0.06)};
              box-shadow: inset 0 1px 2px ${alpha(
                theme.colors.success.dark,
                0.2
              )};
          }
          
          & .${linearProgressClasses.bar} {
              height: 12px;
              margin-top: 7px;
              
              border-radius: ${theme.general.borderRadiusSm};
              background: ${
                data?.worker?.install_status == 'pending'
                  ? theme.colors.warning.main
                  : data?.worker?.install_status == 'installed'
                  ? theme.colors.success.main
                  : theme.colors.info.main
              };
          }
      `
  );

  const handleCreateWorkerOpen = async () => {
    const providersList = await getProviders({
      search: '',
      sort_by: '',
      skip: 0,
      limit: 1000
    });

    setProviders(providersList);
    setOpenFinishInstall(true);
  };

  const handleCreateWorkerClose = (reason) => {
    if (reason && reason == 'backdropClick') {
      return;
    }
    handleEditSuccess(parseInt(router.query.hardwareId));
    setOpenFinishInstall(false);
  };

  return (
    <>
      <Paper sx={{ margin: 3 }}>
        <Grid container padding={3}>
          {/* INFORMATIONS CARD */}
          <Grid
            item
            xs={12}
            marginBottom={'20px'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Box display={'flex'} alignItems={'center'}>
              <InfoIcon />
              <Typography marginLeft={1} variant="h3">
                Informations
              </Typography>
            </Box>
            {!ability.can('manange', 'Hardware-Actions') ? null : (
              <Button
                size={'small'}
                variant={'contained'}
                startIcon={<LaunchTwoToneIcon />}
                onClick={() => handleOpenEdit()}
              >
                Edit
              </Button>
            )}
          </Grid>
          {/*<Grid item xs={12} md={2.5} marginBottom={{xs: '20px', md: 0}}>*/}
          {/*    <img*/}
          {/*        style={{borderRadius: '5px'}}*/}
          {/*        width={'auto'}*/}
          {/*        height={'110px'}*/}
          {/*        src={*/}
          {/*            'https://cdn.mos.cms.futurecdn.net/6QbFZzDxe3LqFStGGksKLk.jpg'*/}
          {/*        }*/}
          {/*    />*/}
          {/*</Grid>*/}
          <Grid item xs={12} sm={6} md={4} marginBottom={{ xs: '20px', sm: 0 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRight: { sm: '2px solid lightGray' }
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: theme.colors.primary.main }}
              >
                Technical
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Brand:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.brand}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Model:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.model}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Serial Number:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.serial_number}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                MAC Address:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.mac_address}
                </Typography>
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            marginBottom={{ xs: '20px', md: 0 }}
            paddingLeft={{ sm: '10px', md: 0 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRight: { md: '2px solid lightGray' },
                marginLeft: { xs: 0, md: '20px' }
              }}
            >
              <Typography
                variant="h4"
                color={'gray'}
                sx={{ color: theme.colors.primary.main }}
              >
                Location
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                City:
                <Typography variant={'h5'} color={'gray'}>
                  Constanta
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Street:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.location_address || '-'}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Coordinates:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.location_coordinates || '-'}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Internet Provider:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.location_internet_provider || '-'}
                </Typography>
              </Typography>
            </Box>
          </Grid>
          {/*<Divider orientation="vertical" flexItem />*/}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{ paddingLeft: { md: '10px', lg: 0 } }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: { xs: 0, lg: '20px' }
              }}
            >
              <Typography
                variant="h4"
                color={'gray'}
                sx={{ color: theme.colors.primary.main }}
              >
                Contact
              </Typography>
              <Typography
                variant={'h5'}
                marginTop={1}
                display="flex"
                whiteSpace={'nowrap'}
                gap={1}
              >
                Name:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.location_contact_person || '-'}
                </Typography>
              </Typography>

              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Phone:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.location_contact_phone || '-'}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Email:
                <Typography variant={'h5'} color={'gray'}>
                  john.doe@gmail.com
                </Typography>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* TECHNICIAN CARD */}
      <Paper sx={{ marginX: 3 }}>
        <Grid container padding={3}>
          <Grid
            item
            xs={12}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            marginBottom={3}
          >
            <Box display={'flex'} alignItems={'center'}>
              <EngineeringIcon />
              <Typography marginLeft={1} variant="h3">
                Technician
              </Typography>
            </Box>
            {/* <Button
              size={'small'}
              variant={'contained'}
              startIcon={<LaunchTwoToneIcon />}
              onClick={() => handleOpenAssign()}
            >
              Reassign
            </Button> */}
          </Grid>
          {/*<Grid item xs={12} md={2.5} marginBottom={{xs: '20px', md: 0}}>*/}
          {/*    <img*/}
          {/*        style={{border: '2px solid lightGray', borderRadius: '100px'}}*/}
          {/*        width={'130px'}*/}
          {/*        height={'130px'}*/}
          {/*        src={*/}
          {/*            'https://cdn-4.motorsport.com/images/mgl/0mb95oa2/s800/lewis-hamilton-mercedes-1.jpg'*/}
          {/*        }*/}
          {/*    />*/}
          {/*</Grid>*/}
          <Grid item xs={12} sm={6} md={4} marginBottom={{ xs: '20px', sm: 0 }}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRight: { sm: '2px solid lightGray' }
              }}
            >
              <Typography
                variant="h4"
                color={'gray'}
                sx={{ color: theme.colors.primary.main }}
              >
                Information
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                First Name:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.technician?.first_name || '-'}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Last Name:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.technician?.last_name || '-'}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Email:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.technician?.email || '-'}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Phone Number:
                <Typography variant={'h5'} color={'gray'}>
                  0745-123-456
                </Typography>
              </Typography>
            </Box>
          </Grid>

          {/*<Divider orientation="vertical" flexItem />*/}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            marginBottom={{ xs: '20px', md: 0 }}
            paddingLeft={{ sm: '10px', md: 0 }}
          >
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRight: { md: '2px solid lightGray' },
                marginLeft: { xs: 0, md: '20px' }
              }}
            >
              <Typography
                variant="h4"
                color={'gray'}
                sx={{ color: theme.colors.primary.main }}
              >
                Job details
              </Typography>
              {/*<Box display="flex">*/}
              {/*  <Typography variant={'h5'} marginTop={1} gap={1}>*/}
              {/*    Status:*/}
              {/*    <Chip*/}
              {/*      size="small"*/}
              {/*      sx={{*/}
              {/*        backgroundColor:*/}
              {/*          data?.worker?.install_status == 'pending'*/}
              {/*            ? theme.colors.warning.main*/}
              {/*            : data?.worker?.install_status == 'installed'*/}
              {/*            ? theme.colors.success.main*/}
              {/*            : data?.technician*/}
              {/*            ? theme.colors.primary.main*/}
              {/*            : theme.colors.info.main,*/}
              {/*        color: theme.palette.common.white,*/}
              {/*        // fontWeight: 'bold',*/}
              {/*        marginLeft: 1,*/}
              {/*        height: '20px'*/}
              {/*      }}*/}
              {/*      label={*/}
              {/*        data?.worker?.install_status == 'pending'*/}
              {/*          ? 'Pending'*/}
              {/*          : data?.worker?.install_status == 'installed'*/}
              {/*          ? 'Installed'*/}
              {/*          : data?.technician*/}
              {/*          ? 'Assigned'*/}
              {/*          : 'Available'*/}
              {/*      }*/}
              {/*    />*/}
              {/*  </Typography>*/}
              {/*</Box>*/}
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Public IP:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.worker?.ipv4 || '-'}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Private IP:
                <Typography variant={'h5'} color={'gray'}>
                  {data?.worker?.private_ipv4 || '-'}
                </Typography>
              </Typography>
              <Typography variant={'h5'} marginTop={1} display="flex" gap={1}>
                Started on:
                <Typography variant={'h5'} color={'gray'}>
                  23-12-2022
                </Typography>
              </Typography>
            </Box>
          </Grid>
          {/*<Divider orientation="vertical" flexItem />*/}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{ paddingLeft: { md: '10px', lg: 0 } }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: { xs: 0, lg: '20px' }
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: theme.colors.primary.main }}
              >
                Status
              </Typography>
              <LinearProgress1
                sx={{
                  my: 1
                }}
                variant="determinate"
                value={
                  data?.worker?.install_status == 'pending'
                    ? 50
                    : data?.worker?.install_status == 'installed'
                    ? 100
                    : 5
                }
              />
              <Typography
                gutterBottom
                variant="subtitle2"
                sx={{
                  color:
                    data?.worker?.install_status == 'pending'
                      ? theme.colors.warning.main
                      : data?.worker?.install_status == 'installed'
                      ? theme.colors.success.main
                      : theme.colors.info.main,
                  fontWeight: 'bold'
                }}
              >
                {data?.worker?.install_status == 'pending'
                  ? 'Pending Installation'
                  : data?.worker?.install_status == 'installed'
                  ? 'Installed'
                  : 'Waiting installation'}
              </Typography>
              {data?.worker?.install_status === 'pending' && (
                <Button
                  onClick={handleCreateWorkerOpen}
                  sx={{ marginTop: '10px' }}
                  size={'small'}
                  variant={'contained'}
                >
                  Finish Install
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* DOCUMENTS CARD */}

      <Paper sx={{ margin: 3 }}>
        <Grid container padding={3}>
          <Grid
            item
            xs={12}
            display={'flex'}
            alignItems={'center'}
            marginBottom={3}
          >
            <ArticleIcon />
            <Typography marginLeft={1} variant="h3">
              Documents
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <List sx={{ padding: 0 }}>
              {data?.invoice ? (
                <ListItem
                  sx={{
                    backgroundColor: alpha(theme.colors.secondary.main, 0.1),
                    borderRadius: '10px',
                    paddingY: '20px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha(theme.colors.primary.main, 0.1)
                    }
                  }}
                >
                  <ListItemIcon sx={{ justifyContent: 'center' }}>
                    <AttachFileIcon sx={{ color: theme.colors.primary.main }} />
                  </ListItemIcon>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: {
                        xs: 'column',
                        sm: 'row'
                      },
                      justifyContent: 'space-between',
                      marginRight: '20px',
                      height: '100%',
                      padding: '7px'
                    }}
                  >
                    <Link href={data.invoice} target={'_blank'}>
                      <ListItemText
                        sx={{
                          color: theme.colors.primary.main,
                          fontWeight: 'extrabold'
                        }}
                        // secondary={'Hardware Invoice'}
                      >
                        <Typography variant={'h5'}>Invoice</Typography>
                        <Typography variant={'subtitle1'}>
                          Invoice from when the hardware was purchased
                        </Typography>
                      </ListItemText>
                    </Link>
                    {/* <Button
                      sx={{ marginTop: { xs: '20px', sm: 0 } }}
                      size={'small'}
                      variant={'contained'}
                    >
                      Modify
                    </Button> */}
                  </Box>
                </ListItem>
              ) : (
                <ListItem
                  sx={{
                    marginTop: '20px',
                    backgroundColor: alpha(theme.colors.secondary.main, 0.1),
                    borderRadius: '10px',

                    paddingY: '20px'
                  }}
                >
                  <ListItemIcon sx={{ justifyContent: 'center' }}>
                    <AttachFileIcon sx={{ color: theme.colors.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      color: theme.colors.primary.main,
                      fontWeight: 'extrabold'
                    }}
                    // secondary={'Hardware Report'}
                  >
                    <Typography variant={'h5'}>No Invoice Available</Typography>
                  </ListItemText>
                </ListItem>
              )}
              {data?.report ? (
                <ListItem
                  sx={{
                    marginTop: '20px',
                    backgroundColor: alpha(theme.colors.secondary.main, 0.1),
                    borderRadius: '10px',
                    cursor: 'pointer',
                    paddingY: '20px',
                    '&:hover': {
                      backgroundColor: alpha(theme.colors.primary.main, 0.1)
                    }
                  }}
                >
                  <ListItemIcon sx={{ justifyContent: 'center' }}>
                    <AttachFileIcon sx={{ color: theme.colors.primary.main }} />
                  </ListItemIcon>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: {
                        xs: 'column',
                        sm: 'row'
                      },
                      justifyContent: 'space-between',
                      marginRight: '20px',
                      height: '100%',
                      padding: '7px'
                    }}
                  >
                    <Link href={data?.report} target={'_blank'}>
                      <ListItemText
                        sx={{
                          color: theme.colors.primary.main,
                          fontWeight: 'extrabold'
                        }}
                        // secondary={'Hardware Report'}
                      >
                        <Typography variant={'h5'}>Report</Typography>
                        <Typography variant={'subtitle1'}>
                          Report from when the hardware was installed
                        </Typography>
                      </ListItemText>
                    </Link>
                    <Button
                      sx={{ marginTop: { xs: '20px', sm: 0 } }}
                      fullWidth={false}
                      size={'small'}
                      variant={'contained'}
                    >
                      Modify
                    </Button>
                  </Box>
                </ListItem>
              ) : (
                <ListItem
                  sx={{
                    marginTop: '20px',
                    backgroundColor: alpha(theme.colors.secondary.main, 0.1),
                    borderRadius: '10px',

                    paddingY: '20px'
                  }}
                >
                  <ListItemIcon sx={{ justifyContent: 'center' }}>
                    <AttachFileIcon sx={{ color: theme.colors.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      color: theme.colors.primary.main,
                      fontWeight: 'extrabold'
                    }}
                    // secondary={'Hardware Report'}
                  >
                    <Typography variant={'h5'}>No Report Available</Typography>
                  </ListItemText>
                </ListItem>
              )}
            </List>
            {/*<Box*/}
            {/*  display={'flex'}*/}
            {/*  alignItems={'center'}*/}
            {/*  justifyContent={'space-between'}*/}
            {/*>*/}
            {/*  <Typography variant="h3">Invoice</Typography>*/}
            {/*  <Button size={'small'} variant={'contained'}>*/}
            {/*    Change Invoice*/}
            {/*  </Button>*/}
            {/*</Box>*/}

            {/*<img*/}
            {/*  style={{*/}
            {/*    borderRadius: '5px',*/}
            {/*    border: '2px solid gray',*/}
            {/*    marginTop: '25px'*/}
            {/*  }}*/}
            {/*  width={'100%'}*/}
            {/*  height={'600px'}*/}
            {/*  src={data?.invoice || 'https://via.placeholder.com/600x600'}*/}
            {/*/>*/}
          </Grid>
          <Grid item xs={12} lg={6} paddingLeft={{ lg: '20px' }}>
            {/*<Box*/}
            {/*  display={'flex'}*/}
            {/*  alignItems={'center'}*/}
            {/*  justifyContent={'space-between'}*/}
            {/*>*/}
            {/*  <Typography variant="h3">Report</Typography>*/}
            {/*  <Button size={'small'} variant={'contained'}>*/}
            {/*    Change Report*/}
            {/*  </Button>*/}
            {/*</Box>*/}
            {/*<Grid>*/}
            {/*  <img*/}
            {/*    style={{*/}
            {/*      borderRadius: '5px',*/}
            {/*      border: '2px solid gray',*/}
            {/*      marginTop: '25px'*/}
            {/*    }}*/}
            {/*    width={'100%'}*/}
            {/*    height={'600px'}*/}
            {/*    src={*/}
            {/*      'https://www.greenclimate.fund/sites/default/files/document/image/cover-7714-1590739485.jpg'*/}
            {/*    }*/}
            {/*  />*/}
            {/*</Grid>*/}
          </Grid>
        </Grid>
      </Paper>

      {/* EDIT HARDWARE FORM*/}
      <Dialog fullWidth maxWidth="md" open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography data-cy="add-stck-form-title" variant="h4" gutterBottom>
            {'Edit Hardware'}
          </Typography>
          <Typography data-cy="add-stock-form-subtitle" variant="subtitle2">
            {'Fill in the fields below to edit Hardware.'}
          </Typography>
        </DialogTitle>
        <Divider />
        <Box sx={{ p: 3 }}>
          <EditHardwareForm
            data={data}
            handleHardwareUpdated={handleSuccessEdit}
          />
        </Box>
      </Dialog>

      {/*  ASSIGN HARDWARE DIALOG  */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openAssign}
        onClose={handleCloseAssign}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography data-cy="add-stck-form-title" variant="h4" gutterBottom>
            {'Assing Hardware'}
          </Typography>
          <Typography data-cy="add-stock-form-subtitle" variant="subtitle2">
            {'Fill in the fields below to assign hardware.'}
          </Typography>
        </DialogTitle>
        <Divider />
        <Box sx={{ p: 3 }}>
          <AssignHardwareForm handleAssignSuccess={handleAssignSuccess} />
        </Box>
      </Dialog>

      {/* FINISH INSTALL HARDWARE FORM*/}
      <Dialog
        fullWidth
        maxWidth="md"
        disableEscapeKeyDown
        open={openFinishInstall}
        onClose={handleCreateWorkerClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCreateWorkerClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom>
            {'Add a new worker'}
          </Typography>
          <Typography variant="subtitle2">
            {
              'Fill in the fields below to create and add a new worker to the site'
            }
          </Typography>
        </DialogTitle>
        <InstallWorker
          initialData={data}
          onClose={handleCreateWorkerClose}
          providers={providers}
        />
      </Dialog>
    </>
  );
}

HardwareContent.propTypes = hardwareProps;

export default HardwareContent;
