import { useState } from "react";
import * as yup from "yup";
import { Form, Formik, FormikProps } from "formik";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useUploadFile, useRegisterUser } from "@/common";

export const ProfileForm = ({ handleClose }: { handleClose: () => void }) => {
  const [imageHash, setImageHash] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { uploadFile } = useUploadFile();
  const registerUser = useRegisterUser()

  const validationSchema = yup.object({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .required("Username is required"),
    image: yup.mixed().required("Profile image is required"),
  });

  const initialValues = {
    username: "",
    image: null,
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3, width: "585px" }}>
      <Card
        elevation={3}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <CardContent>
          <Stack
            width={"100%"}
            alignItems={"center"}
            justifyContent={"space-between"}
            direction={"row"}
          >
            <Box></Box>
            <IconButton onClick={() => handleClose()}>
              <Close />
            </IconButton>
          </Stack>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
          >
            Create Your Profile
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                const registrationResult = await registerUser(
                  values.username,
                  imageHash
                );
                if (registrationResult) {
                  router.push("/chat");
                }
              } catch (error) {
                console.error("Registration failed:", error);
              }
            }}
          >
            {({ values, errors, touched, setFieldValue, handleBlur, isValid, isSubmitting }: FormikProps<typeof initialValues>) => {
              const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (file) {
                  setUploading(true);
                  try {
                    const hash = await uploadFile(file);
                    if (hash) {
                      setImageHash(hash);
                      setImageUrl(URL.createObjectURL(file));
                      setFieldValue("image", hash);
                    }
                  } catch (err) {
                    console.error("Image upload failed", err);
                  } finally {
                    setUploading(false);
                  }
                }
              };

              return (
                <Form>
                  <Stack spacing={3} alignItems="center">
                    <Stack alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          overflow: "hidden",
                          borderRadius: "50%",
                        }}
                      >
                        <Avatar
                          src={imageUrl || ""}
                          alt="Profile"
                          sx={{
                            width: 120,
                            height: 120,
                            bgcolor: "rgba(255,255,255,0.2)",
                            fontSize: "2rem",
                            cursor: "pointer",
                          }}
                        >
                          {!imageUrl && "?"}
                        </Avatar>

                        <Box
                          component="label"
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "40%",
                            bgcolor: "rgba(0,0,0,0.5)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            borderBottomLeftRadius: "50%",
                            borderBottomRightRadius: "50%",
                          }}
                        >
                          {uploading ? (
                            <CircularProgress size={20} sx={{ color: "white" }} />
                          ) : (
                            "Change Photo"
                          )}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </Box>
                      </Box>

                      <Collapse in={touched.image && Boolean(errors.image)}>
                        <Typography color="error" variant="body2">
                          {errors.image}
                        </Typography>
                      </Collapse>
                    </Stack>
                    <Stack width="100%" spacing={0.5}>
                      <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label="Username (ENS Domain)"
                        value={values.username}
                        onChange={(event) => {
                          setFieldValue(
                            "username",
                            (event.target as HTMLInputElement).value
                          );
                        }}
                        onBlur={handleBlur}
                        error={touched.username && Boolean(errors.username)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "rgba(255,255,255,0.1)",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.5)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(255,255,255,0.8)",
                            },
                          },
                          "& .MuiCollapse-root MuiCollapse-vertical MuiCollapse-entered": {
                            marginTop: 0,
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255,255,255,0.8)",
                          },
                          "& .MuiInputBase-input": {
                            color: "white",
                          },
                        }}
                      />
                      <Collapse
                        in={touched.username && Boolean(errors.username)}
                        sx={{
                          marginTop: 0,
                        }}
                      >
                        <Typography color="error">
                          {errors.username}
                        </Typography>
                      </Collapse>
                    </Stack>

                    <TextField
                      fullWidth
                      label="IPFS Hash"
                      value={`https://ipfs.io/ipfs/${imageHash}`}
                      disabled
                      variant="outlined"
                      slotProps={{
                        input: { 
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              {uploading ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                imageHash && <Check color="success" />
                              )}
                            </InputAdornment>
                          ),
                        }
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255,255,255,0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={!isValid}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 5px 10px 2px rgba(33, 203, 243, .3)",
                        },
                        "&:disabled": {
                          background: "rgba(255,255,255,0.3)",
                        },
                      }}
                    >
                      {isSubmitting ? (<Stack alignContent={"center"} justifyContent={"center"}>
                        <CircularProgress size={24} color="inherit" />
                      </Stack>) : "Create Profile"}
                    </Button>
                  </Stack>
                </Form>
              );
            }}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};
