import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import CourseModal from "./CourseModal";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { toggleSaveCourse } from "./../lib/api";
import axios from "axios";
import { useSession } from "../context/SessionContext";
import { Draggable } from "@hello-pangea/dnd";
import { fullCourseCode } from "../lib/courseUtils";

const CourseCard = ({ course, semester = null, removeSavedCourse = null }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, dispatch } = useSession();

  const handleToggleSave = async (event) => {
    event.stopPropagation();
    toggleSaveCourse(user.id, course.id, !isBookmarked);
    setIsBookmarked(!isBookmarked);
    if (removeSavedCourse) {
      removeSavedCourse(course.id);
    }
  };
  /*
    known issue: when toggling bookmarks in search/saved panel, 
    bookmark icon will not toggle in semester pane until refresh
  */

  const handleUnselect = async (event) => {
    event.stopPropagation();

    dispatch({ type: "DELETE", payload: { course, semester } });
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
      <Draggable
        key={course.id}
        draggableId={course.id + (semester ? `s-${semester}` : "")}
        index={course.id}
      >
        {(provided) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              border: "1px solid #800000",
              borderRadius: "12px",
              cursor: "pointer",
              width: "100%",
            }}
            onClick={() => {
              setOpen(true);
            }}
          >
            <CardContent sx={{ position: "relative" }}>
              {isAuthenticated && (
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

              {semester && (
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
                sx={{
                  color: "grey.900",
                  fontSize: "1.2em",
                  fontWeight: "bold",
                }}
              >
                {course.title}
              </Typography>
              <Typography
                className="course-title"
                sx={{ fontWeight: "bold", color: "grey.700", fontSize: "1em" }}
              >
                {fullCourseCode(course)}
              </Typography>
              <Typography
                className="course-credits"
                sx={{ color: "grey.700", fontSize: "0.8em" }}
              >
                Credits: {course.credits}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Draggable>
      <CourseModal course={course} open={open} setOpen={setOpen}></CourseModal>
    </>
  );
};

export default CourseCard;
