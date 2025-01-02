import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { List, ListItem, Stack } from "@mui/material";

const initialData = [
  { id: "1", text: "Task 1" },
  { id: "2", text: "Task 2" },
  { id: "3", text: "Task 3" },
  { id: "4", text: "Task 4" },
];

function DragAndDrop() {
  const [tasks, setTasks] = useState(initialData);
  const [depositTasks, setDepositTasks] = useState([]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Handle reordering within the same list
      const items =
        source.droppableId === "droppable"
          ? Array.from(tasks)
          : Array.from(depositTasks);

      const [movedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, movedItem);

      if (source.droppableId === "droppable") {
        setTasks(items);
      } else {
        setDepositTasks(items);
      }
    } else {
      // Handle moving between lists

      if (source.droppableId === "droppable2") return;

      const sourceItems =
        source.droppableId === "droppable"
          ? Array.from(tasks)
          : Array.from(depositTasks);
      const destinationItems =
        destination.droppableId === "droppable"
          ? Array.from(tasks)
          : Array.from(depositTasks);

      const movedItem = sourceItems[source.index];
      destinationItems.splice(destination.index, 0, movedItem);

      if (source.droppableId === "droppable") {
        setTasks(sourceItems);
        setDepositTasks(destinationItems);
      } else {
        setDepositTasks(sourceItems);
        setTasks(destinationItems);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Stack direction="row" spacing={2} justifyContent={"space-around"}>
        {/* First List */}
        <Droppable droppableId="droppable">
          {(provided) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                minWidth: 400,
                maxWidth: 400,
                margin: "0 auto",
                backgroundColor: "#f0f0f0",
                padding: 2,
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        mb: 1,
                        backgroundColor: "white",
                        borderRadius: 1,
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                          backgroundColor: "#f9f9f9",
                        },
                      }}
                    >
                      {task.text}
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>

        {/* Second List */}
        <Droppable droppableId="droppable2">
          {(provided) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                minWidth: 400,
                maxWidth: 400,
                margin: "0 auto",
                backgroundColor: "#f0f0f0",
                padding: 2,
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {depositTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        mb: 1,
                        backgroundColor: "white",
                        borderRadius: 1,
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                          backgroundColor: "#f9f9f9",
                        },
                      }}
                    >
                      {task.text}
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </Stack>
    </DragDropContext>
  );
}

export default DragAndDrop;
