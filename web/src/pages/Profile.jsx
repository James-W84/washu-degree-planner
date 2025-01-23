import {
  Container,
  Typography,
  Grid2 as Grid,
  Stack,
  Autocomplete,
  TextField,
  Box,
  Button,
  Modal,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [primarySchool, setPrimarySchool] = useState();
  const [secondarySchool, setSecondarySchool] = useState();
  const [primaryMajor, setPrimaryMajor] = useState();
  const [modalPrimaryMajor, setModalPrimaryMajor] = useState();
  const [error, setError] = useState(false);

  const [schools, setSchools] = useState([]);
  const [majors, setMajors] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { userId, isLoggedIn } = useAuth();

  const fetchUser = async (userId) => {
    if (!isLoggedIn) {
      console.error("User not logged in - login to view profile.");
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/user/profile/${userId}`
      );
      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
      setPrimaryMajor(response.data.primaryMajor ?? null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/degree/schools`
      );
      setSchools(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchMajors = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/degree/majors`
      );
      setMajors(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/user/editProfile`,
        {
          userId: user.id,
          name,
          email,
          primaryMajorId: primaryMajor?.id,
        }
      );

      setUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancelEdit = () => {
    setName(user.name);
    setEmail(user.email);
    setPrimarySchool(user.schoolPrimary ?? null);
    setSecondarySchool(user.schoolSecondary ?? null);
    setPrimaryMajor(user.primaryMajor ?? null);
    setEditing(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setModalPrimarySchool(primarySchool);
    setModalSecondarySchool(secondarySchool);
    setModalPrimaryMajor(primaryMajor);
  };

  const handleCloseModal = () => {
    // setModalPrimarySchool(null);
    // setModalSecondarySchool(null);
    setModalPrimaryMajor(null);
    setOpenModal(false);
  };

  const handleSaveModal = () => {
    if (!modalPrimaryMajor) {
      setError(true);
    } else {
      // setPrimarySchool(modalPrimarySchool);
      // setSecondarySchool(modalSecondarySchool);
      setPrimaryMajor(modalPrimaryMajor);
      setOpenModal(false);
      setError(false);
    }
  };

  useEffect(() => {
    fetchUser(userId);
    fetchMajors();
  }, [userId]);

  return (
    <Container
      maxWidth={false}
      sx={{
        paddingTop: "5%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h2">User Profile</Typography>
      <Grid
        container
        rowSpacing={"1em"}
        width={"35%"}
        sx={{ marginTop: "3em" }}
      >
        <Grid size={6} sx={{ textAlign: "left" }}>
          <Stack spacing={"1em"}>
            <Box minHeight={"2em"}>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Name:
              </Typography>
            </Box>
            <Box minHeight={"2em"}>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Email:
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={"bold"}>
              Major:
            </Typography>
            {editing && (
              <Button
                variant="outlined"
                onClick={handleOpenModal}
                sx={{ maxWidth: "33%" }}
              >
                <EditIcon></EditIcon>
              </Button>
            )}
          </Stack>
        </Grid>

        <Grid size={6} sx={{ textAlign: "right" }}>
          {editing ? (
            <Stack spacing={"1em"}>
              <Box minHeight={"2em"}>
                <TextField
                  variant="standard"
                  fullWidth
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  inputProps={{
                    style: { textAlign: "right" },
                  }}
                ></TextField>
              </Box>
              <Box minHeight={"2em"}>
                <TextField
                  variant="standard"
                  fullWidth
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  inputProps={{
                    style: { textAlign: "right" },
                  }}
                ></TextField>
              </Box>
              <Box minHeight={"2em"}>
                <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
                  {primaryMajor?.title ?? "Major not yet selected."}
                </Typography>
              </Box>
            </Stack>
          ) : (
            <Stack spacing={"1em"}>
              <Box minHeight={"2em"}>
                <Typography variant="subtitle1">
                  {user.name ?? "unspecified"}
                </Typography>
              </Box>
              <Box minHeight={"2em"}>
                <Typography variant="subtitle1">{user.email}</Typography>
              </Box>
              <Box minHeight={"2em"}>
                <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
                  {user.primaryMajor?.title ?? "Major not yet selected."}
                </Typography>
              </Box>
            </Stack>
          )}
        </Grid>
      </Grid>
      {editing ? (
        <Stack>
          <Button
            sx={{ marginTop: "3em" }}
            onClick={handleEdit}
            variant="contained"
          >
            Save
          </Button>
          <Button
            sx={{ marginTop: "1em" }}
            onClick={handleCancelEdit}
            variant="contained"
          >
            Cancel
          </Button>
        </Stack>
      ) : (
        <Stack>
          <Button
            sx={{ marginTop: "3em" }}
            onClick={() => {
              setEditing(true);
            }}
            variant="contained"
          >
            Edit
          </Button>
          <Button href="/" sx={{ marginTop: "1em" }} variant="contained">
            Home
          </Button>
        </Stack>
      )}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Stack
          spacing={"1em"}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h2">Major Programs</Typography>
          <Autocomplete
            options={majors}
            getOptionLabel={(option) => option.title}
            value={modalPrimaryMajor}
            renderInput={(params) => (
              <TextField {...params} label="Primary Major" />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, newValue) => {
              setModalPrimaryMajor(newValue);
            }}
          ></Autocomplete>

          {error && (
            <Typography variant="body1" color="#FF0000">
              Please select a primary program of study.
            </Typography>
          )}
          <Button
            sx={{ marginTop: "1em" }}
            variant="contained"
            onClick={handleSaveModal}
          >
            Save
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}

export default Profile;
