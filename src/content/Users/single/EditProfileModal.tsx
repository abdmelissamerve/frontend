import { useCallback, useEffect, useRef, useState, FC } from "react";
import { useRouter } from "next/router";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { fetchCurrentUser, updateCurrentUser } from "@/services/admin/users";

import {
    Box,
    Button,
    alpha,
    Popover,
    Typography,
    styled,
    useTheme,
    TextField,
    CircularProgress,
    FormHelperText,
    Zoom,
    Grid,
    IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useAuth } from "@/hooks/useAuth";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Link from "src/components/Link";
import CloseIcon from "@mui/icons-material/Close";
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
const EditProfileButton = styled(Button)(
    ({ theme }) => `
  width: ${theme.spacing(15)};
  padding: 0;
  height: ${theme.spacing(4)};
  margin-left: ${theme.spacing(1)};
  border-radius: ${theme.general.borderRadiusLg};
  border: ${theme.colors.primary.main} solid 2px;
  &:hover {
    color: ${theme.colors.primary.main};
  }
`
);
const EditProfileBox = styled(Box)(
    ({ theme }) => `
          background: ${alpha(theme.colors.alpha.black[100], 0.08)};
          padding-top: ${theme.spacing(1)};
          padding-bottom: ${theme.spacing(2)};
          padding-left: ${theme.spacing(2)};
          padding-right: ${theme.spacing(2)};
  `
);

interface Props {
    getProfile: Function;
}

const EditButton: FC<Props> = ({ getProfile }) => {
    const { user } = useAuth();

    const [isOpen, setOpen] = useState<boolean>(false);
    const [editUser, setEditUser] = useState(false);

    const [photo, setPhoto] = useState(null);
    const [photoLabel, setPhotoLabel] = useState("");
    const [photoErrorMessage, setPhotoErrorMessage] = useState("");
    const [showPhotoErrorMessage, setShowPhotoErrorMessage] = useState(false);
    const [percent, setPercent] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [path, setPath] = useState("");
    const [url, setUrl] = useState("");

    const handleOpen = (): void => {
        setOpen(true);
        setPhoto(null);
        setPhotoLabel("");
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const { enqueueSnackbar } = useSnackbar();

    const handleFileUpload = (name, file, location) => {
        setUploading(true);
        const storage = getStorage();
        const storageRef = ref(storage, `/${location}/${name}`);
        setPath(`/${location}}/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setPercent(percent);
                if (percent == 100) setUploading(false);
            },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setUrl(url);
                    formik.setFieldValue("photo_url", url);
                });
            }
        );
    };

    const handleFileDelete = (path) => {
        const storage = getStorage();
        const storageRef = ref(storage, path);
        deleteObject(storageRef).catch((error) => {
            console.log(error);
        });
    };

    const formik = useFormik({
        initialValues: {
            first_name: user?.first_name,
            last_name: user?.last_name,
            photo_url: user?.photo_url,
            submit: null,
        },
        validationSchema: Yup.object({
            first_name: Yup.string().max(255),
            last_name: Yup.string().max(255),
        }),
        onSubmit: async (_values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
            try {
                await updateCurrentUser(_values);
                setStatus({ success: true });
                setSubmitting(false);
                handleEditUserSuccess();
                setEditUser(false);
                await getProfile();
                setOpen(false);
            } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
            }
        },
    });

    const handleEditUserSuccess = () => {
        enqueueSnackbar("The user was edited successfully", {
            variant: "success",
            anchorOrigin: {
                vertical: "top",
                horizontal: "right",
            },
            TransitionComponent: Zoom,
            autoHideDuration: 1000,
        });
    };

    return (
        <>
            <EditProfileButton color="primary" onClick={handleOpen}>
                <Typography variant="inherit">Edit your profile</Typography>
            </EditProfileButton>
            <Popover
                disableScrollLock
                onClose={handleClose}
                open={isOpen}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
            >
                <EditProfileBox>
                    <Grid
                        container
                        sx={{
                            maxWidth: 400,
                            maxHeight: 400,
                            minWidth: 400,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Button
                            sx={{
                                padding: 0,
                                maxWidth: "25px",
                                maxHeight: "25px",
                                minWidth: "25px",
                                minHeight: "25px",
                                marginLeft: "auto",
                                marginRight: 0,
                            }}
                            startIcon={
                                <CloseIcon
                                    sx={{
                                        padding: 0,
                                        marginRight: "-10px",
                                    }}
                                />
                            }
                            onClick={() => setOpen(!isOpen)}
                        ></Button>

                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{
                                        marginBottom: 0,
                                        marginTop: 1,
                                        backgroundColor: "white",
                                        borderRadius: 1,
                                    }}
                                    error={Boolean(formik.touched.first_name && formik.errors.first_name)}
                                    fullWidth
                                    helperText={formik.touched.first_name && formik.errors.first_name}
                                    label={"First name"}
                                    placeholder={"Your first name..."}
                                    margin="normal"
                                    name="first_name"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="first_name"
                                    variant="outlined"
                                    value={formik.values.first_name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{
                                        marginBottom: 0,
                                        backgroundColor: "white",
                                        borderRadius: 1,
                                    }}
                                    fullWidth
                                    helperText={formik.touched.last_name && formik.errors.last_name}
                                    label={"Last name"}
                                    placeholder={"Your last name..."}
                                    margin="normal"
                                    name="last_name"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="last_name"
                                    variant="outlined"
                                    value={formik.values.last_name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                <Button
                                    variant="contained"
                                    sx={{ width: "100%", marginTop: 1 }}
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                    data-cy="upload-logo-button"
                                >
                                    Upload Profile Picture
                                    <input
                                        name="photo"
                                        accept="image/jpg, image/png, image/jpeg, application/pdf"
                                        id="contained-button-file"
                                        type="file"
                                        hidden
                                        onChange={(e) => {
                                            const fileReader = new FileReader();
                                            fileReader.onload = () => {
                                                if (fileReader.readyState === 2) {
                                                    setPhoto(fileReader.result);
                                                }
                                            };
                                            if (!e.target.files[0]) return;
                                            setPhoto(null);
                                            setPhotoLabel("");
                                            setPhotoErrorMessage("");
                                            setShowPhotoErrorMessage(false);
                                            if (e.target.files[0].size > 5 * 1024 * 1024) {
                                                setPhotoErrorMessage("File is too large!");
                                                setShowPhotoErrorMessage(true);
                                                return;
                                            }
                                            setPhotoLabel(e.target.files[0].name);
                                            handleFileUpload(
                                                e.target.files[0].name,
                                                e.target.files[0],
                                                "profile_picture"
                                            );

                                            fileReader.readAsDataURL(e.target.files[0]);
                                        }}
                                    />
                                </Button>
                                {uploading && (
                                    <Box
                                        sx={{
                                            padding: 2,
                                            marginTop: 2,
                                            border: "1px dashed",
                                            borderRadius: 1,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <CircularProgress size="1rem" />
                                    </Box>
                                )}
                                {photoErrorMessage && (
                                    <Box
                                        sx={{
                                            padding: 2,
                                            color: "red",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography>{photoErrorMessage}</Typography>
                                    </Box>
                                )}
                                {photo && photoLabel && url && (
                                    <Box
                                        sx={{
                                            padding: 2,
                                            marginTop: 2,
                                            border: "1px dashed",
                                            borderRadius: 1,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <IconButton
                                            sx={{ marginLeft: 1, color: "red" }}
                                            onClick={() => {
                                                setPhoto(null);
                                                setPhotoLabel("");
                                                handleFileDelete(path);
                                                formik.setFieldValue("photo_url", "");
                                            }}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </Grid>

                            <Button
                                sx={{
                                    mt: 2.5,
                                }}
                                color="primary"
                                startIcon={formik.isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={formik.isSubmitting}
                                size="large"
                                fullWidth
                                type="submit"
                                variant="contained"
                            >
                                Change profile
                            </Button>
                            {Boolean(formik.touched.submit && formik.errors.submit) && (
                                <FormHelperText error>{formik.errors.submit}</FormHelperText>
                            )}
                        </form>
                    </Grid>
                </EditProfileBox>
            </Popover>
        </>
    );
};

export default EditButton;
