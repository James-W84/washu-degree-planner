import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { toggleSaveCourse } from "./../lib/api";
import axios from "axios";
import { useSession } from "../context/SessionContext";

const CourseCard = ({
  course,
  planner = false,
  fetchCourses = null,
  fetchSavedCourses = null,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user, isAuthenticated } = useSession();

  const handleToggleSave = async (event) => {
    event.stopPropagation();
    await toggleSaveCourse(user.id, course.id, !isBookmarked);
    setIsBookmarked(!isBookmarked);
    if (fetchSavedCourses) {
      fetchSavedCourses();
    }
  };

  const handleUnselect = async (event) => {
    event.stopPropagation();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/course/unselect`,
        {
          userId: user.id,
          courseId: course.id,
        }
      );
      if (fetchCourses) {
        fetchCourses();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIsSaved = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/course/isSaved/${user.id}/${course.id}`
      );

      setIsBookmarked(response.data.saved);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchIsSaved();
    }
  }, [user, isAuthenticated]);

  return (
    <>
      <Card
        sx={{
          border: "1px solid #800000",
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        <CardContent sx={{ position: "relative" }}>
          {isAuthenticated && !planner && (
            <IconButton
              aria-label="bookmark"
              onClick={handleToggleSave}
              sx={{
                position: "absolute",
                top: -12,
                right: 2,
              }}
            >
              <BookmarkIcon color={isBookmarked ? "primary" : "disabled"} />
            </IconButton>
          )}

          {planner && (
            <IconButton
              aria-label="add course"
              onClick={handleUnselect}
              sx={{
                position: "absolute",
                bottom: -3,
                right: 2,
              }}
            >
              <RemoveCircleOutlineIcon color={"primary"} />
            </IconButton>
          )}
          <Typography
            variant="h6"
            className="course-code"
            sx={{ color: "grey.900", fontSize: "1.2em", fontWeight: "bold" }}
          >
            {course.title}
          </Typography>
          <Typography
            className="course-title"
            sx={{ fontWeight: "bold", color: "grey.700", fontSize: "1em" }}
          >
            {course.departmentCode} {course.courseCode}
          </Typography>
          <Typography
            className="course-credits"
            sx={{ color: "grey.700", fontSize: "0.8em" }}
          >
            Credits:{course.credits}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default CourseCard;
