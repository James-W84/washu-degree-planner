import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  List,
  ListItem,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { Droppable } from "@hello-pangea/dnd";
import { useSession } from "../context/SessionContext";

const SavedCourses = () => {
  const [loading, setLoading] = useState(true);
  const [savedCourses, setSavedCourses] = useState([]);
  const { user, isAuthenticated } = useSession();

  const fetchSavedCourses = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/course/saved/${user.id}`
      );

      setSavedCourses(response.data.savedCourses);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const removeSavedCourse = (courseId) => {
    setSavedCourses((savedCourses) =>
      savedCourses.filter((course) => course.id !== courseId)
    );
  };

  useEffect(() => {
    fetchSavedCourses();
  }, [user]);

  return (
    <Box
      textAlign={"center"}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      flexDirection={"column"}
      sx={{ height: "calc(100vh - 15em)" }}
    >
      <Typography variant="h6">Saved Courses</Typography>
      <Divider width={"65%"} sx={{ marginY: "0.5em" }}></Divider>
      {loading ? (
        <CircularProgress> </CircularProgress>
      ) : !isAuthenticated ? (
        <Typography variant="subtitle1">
          Log in to view your saved courses.
        </Typography>
      ) : savedCourses.length === 0 ? (
        <Typography variant="subtitle1">
          No courses saved yet. Click the bookmark icon on a course card to save
          it for later.
        </Typography>
      ) : (
        <Droppable droppableId="saved">
          {(provided) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "calc (100vh - 13em)",
                overflowY: "scroll",
                flexGrow: 1,
                marginBottom: 0,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none", // For Internet Explorer
                scrollbarWidth: "none", // For Firefox
              }}
            >
              <List
                spacing={0.5}
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ width: "100%" }}
              >
                {loading ? (
                  <CircularProgress />
                ) : (
                  savedCourses.map((course) => (
                    <ListItem
                      key={course.id}
                      sx={{ width: "100%", display: "flex", paddingX: 0 }}
                    >
                      <CourseCard
                        course={course}
                        removeSavedCourse={removeSavedCourse}
                      />
                    </ListItem>
                  ))
                )}
                {provided.placeholder}
              </List>
            </Box>
          )}
        </Droppable>
      )}
    </Box>
  );
};

export default SavedCourses;
