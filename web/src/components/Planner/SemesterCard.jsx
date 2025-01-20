import { Droppable } from "@hello-pangea/dnd";
import { alpha } from "@mui/material/styles";
import { Box, Typography, List, ListItem } from "@mui/material";
import CourseCard from "../CourseCard";
import { useSession } from "../../context/SessionContext";

function SemesterCard({ year, semester }) {
  const semesterIdx = (year - 1) * 2 + semester;
  const { state } = useSession();

  return (
    <Box
      width={"48%"}
      height={"100%"}
      borderRadius={"1em"}
      sx={{
        backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.1),
        border: "3px inset",
        borderColor: (theme) => alpha(theme.palette.primary.light, 0.3),
      }}
      paddingY={"1em"}
      textAlign={"center"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent="flex-start"
    >
      <Typography variant="h2">{semester === 1 ? "Fall" : "Spring"}</Typography>
      <Box
        sx={{
          overflowY: "scroll",
          minHeight: "100%",

          paddingBottom: "6em",
          paddingX: "4%",
          textAlign: "left",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none", // For Internet Explorer
          scrollbarWidth: "none", // For Firefox
        }}
      >
        <Droppable droppableId={semesterIdx.toString()}>
          {(provided) => (
            <List
              spacing={1}
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ minHeight: "100%" }}
            >
              {state[semesterIdx].map((course) => (
                <ListItem key={course.id} sx={{ paddingX: 0 }}>
                  <CourseCard course={course} semester={semester} />
                </ListItem>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </Box>
    </Box>
  );
}

export default SemesterCard;
