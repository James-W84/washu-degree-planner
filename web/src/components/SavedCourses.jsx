import {
  Stack,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { useAuth } from "../context/AuthContext";

const SavedCourses = () => {
  const [loading, setLoading] = useState(true);
  const [savedCourses, setSavedCourses] = useState([]);
  const { userId, isLoggedIn } = useAuth();

  const fetchSavedCourses = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/course/saved/${userId}`
      );

      setSavedCourses(response.data.savedCourses);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchSavedCourses();
  }, [userId]);

  return (
    <Box
      textAlign={"center"}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      flexDirection={"column"}
      height={"100%"}
      marginY={"2em"}
      sx={{ marginBottom: "6em" }}
    >
      <Typography variant="h6">Saved Courses</Typography>
      <Divider width={"65%"} sx={{ marginY: "1em" }}></Divider>
      {loading ? (
        <CircularProgress> </CircularProgress>
      ) : !isLoggedIn ? (
        <Typography variant="subtitle1">
          Log in to view your saved courses.
        </Typography>
      ) : savedCourses.length === 0 ? (
        <Typography variant="subtitle1">
          No courses saved yet. Click the bookmark icon on a course card to save
          it for later.
        </Typography>
      ) : (
        <Box
          sx={{
            overflowY: "scroll",
            paddingBottom: "6em",
            width: "95%",
            textAlign: "left",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none", // For Internet Explorer
            "scrollbar-width": "none", // For Firefox
          }}
        >
          <Stack spacing={2}>
            {savedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                fetchSavedCourses={fetchSavedCourses}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default SavedCourses;