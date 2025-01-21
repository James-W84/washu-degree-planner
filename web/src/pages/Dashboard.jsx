import { Stack, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { DragDropContext } from "@hello-pangea/dnd";
import CoursePlanner from "../components/Planner/CoursePlanner";
import { useSession } from "../context/SessionContext";
import axios from "axios";

function Dashboard() {
  const [mainContentPage, setMainContentPage] = useState("planner");
  const { dispatch, checkAlreadySelected } = useSession();

  const handleMainContentPageChange = (event, newMainContentPage) => {
    if (newMainContentPage !== null) {
      setMainContentPage(newMainContentPage);
    }
  };

  const handleDragEnd = async (rubric) => {
    const { draggableId, source, destination } = rubric;

    if (!destination || source.droppableId === destination.droppableId) return;

    if (source.droppableId === "search" || source.droppableId === "saved") {
      if (checkAlreadySelected(draggableId)) {
        alert("already selected this course");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/course/one/${draggableId}`
        );

        dispatch({
          type: "ADD",
          payload: {
            course: response.data,
            semester: parseInt(destination.droppableId),
          },
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/course/one/${draggableId}`
        );

        dispatch({
          type: "CHANGE",
          payload: {
            course: response.data,
            semesterFrom: parseInt(source.droppableId),
            semesterTo: parseInt(destination.droppableId),
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Header></Header>

      <Stack direction="row" spacing={2} sx={{ padding: "1em" }}>
        <Stack
          direction={"column"}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ToggleButtonGroup
            exclusive
            value={mainContentPage}
            onChange={handleMainContentPageChange}
            sx={{ width: "90%", marginBottom: "1em", height: "2em" }}
          >
            <ToggleButton
              value="planner"
              aria-label="planner"
              sx={{ width: "100%" }}
            >
              Plan
            </ToggleButton>
            <ToggleButton
              value="progress"
              aria-label="progress"
              sx={{ width: "100%" }}
            >
              Progress
            </ToggleButton>
          </ToggleButtonGroup>
          <Sidebar />
        </Stack>
        <Box sx={{ flex: 2 }}>
          {/* {mainContentPage === "planner" ? <Planner /> : <Progress />} */}
          <CoursePlanner></CoursePlanner>
        </Box>
      </Stack>
    </DragDropContext>
  );
}

export default Dashboard;
