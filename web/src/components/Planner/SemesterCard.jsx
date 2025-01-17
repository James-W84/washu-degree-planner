import { Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import { alpha } from "@mui/material/styles";
import { Box, CircularProgress, Typography, List } from "@mui/material";
import CourseCard from "../CourseCard";

function SemesterCard({ year, semester }) {
  const [loading, setLoading] = useState(false);

  return (
    <Box
      width={"48%"}
      height={"100%"}
      borderRadius={"2em"}
      sx={{
        backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.5),
      }}
      paddingY={"1em"}
      textAlign={"center"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent="flex-start"
    >
      {loading ? (
        <CircularProgress> </CircularProgress>
      ) : (
        <>
          <Typography variant="h2">
            {semester === 1 ? "Fall" : "Spring"}
          </Typography>
          <Box
            sx={{
              overflowY: "scroll",
              minHeight: "100%",
              marginTop: "1em",
              paddingBottom: "6em",
              paddingX: "2%",
              textAlign: "left",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              msOverflowStyle: "none", // For Internet Explorer
              scrollbarWidth: "none", // For Firefox
            }}
          >
            <Droppable droppableId={`semester${year}-${semester}`}>
              {(provided) => (
                <List
                  spacing={1}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ minHeight: "100%" }}
                >
                  {/* {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    planner={true}
                    fetchCourses={fetchCourses}
                  />
                ))} */}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </Box>
        </>
      )}
    </Box>
  );
}

export default SemesterCard;
