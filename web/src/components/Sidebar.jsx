import { useState } from "react";
import { Button, Box, ButtonGroup, Stack } from "@mui/material";
import Search from "./Search";
import SavedCourses from "./SavedCourses";

const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState("search");

  return (
    <Stack
      sx={{
        position: "relative",
        padding: 3,
        border: "2px solid #A51416",
        borderRadius: 2,
        height: "calc(100vh - 13em)",
        overflowY: "hidden",
        width: "85%",
        alignItems: "center",
      }}
    >
      <Box height={"calc(100vh - 15em)"} width={"100%"}>
        {selectedTab === "search" && <Search />}
        {selectedTab === "saved" && <SavedCourses />}
      </Box>
      <Box
        sx={{
          width: "90%",
          marginTop: "2%",
          height: "6em",
        }}
      >
        <ButtonGroup
          exclusive
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            onClick={() => setSelectedTab("search")}
            sx={{
              backgroundColor:
                selectedTab === "search" ? "primary.main" : "white",
              width: "50%",
              color: selectedTab === "search" ? "white" : "primary.main",
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => setSelectedTab("saved")}
            sx={{
              backgroundColor:
                selectedTab === "saved" ? "primary.main" : "white",
              width: "50%",
              color: selectedTab === "saved" ? "white" : "primary.main",
            }}
          >
            Saved
          </Button>
        </ButtonGroup>
      </Box>
    </Stack>
  );
};

export default Sidebar;
