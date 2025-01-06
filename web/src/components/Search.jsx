import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Typography,
  Box,
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CourseCard from "./CourseCard";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCredits, setSelectedCredits] = useState("");
  const [departments, setDepartments] = useState([]);
  const [creditAmounts, setCreditAmounts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const itemsPerPage = 15;

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    setPage(1);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setPage(1);
  };

  const handleCreditsChange = (event) => {
    setSelectedCredits(event.target.value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearchText("");
    setSelectedDepartment("");
    setSelectedCredits("");
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      if (selectedDepartment) {
        params.append("department", selectedDepartment);
      }
      if (selectedCredits) {
        params.append("credits", selectedCredits);
      }
      if (searchText) {
        params.append("search", searchText);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/course/all?${params.toString()}`
      );
      const data = await response.json();
      setCourses(data.courses || []);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, selectedDepartment, selectedCredits, searchText]);

  useEffect(() => {
    fetchDepartments();
    fetchCreditAmounts();
  }, []);

  const handlePageChange = (event, newPage) => {
    console.log("Page changed to:", newPage);
    setPage(newPage);
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/course/departments`
      );
      const data = await response.json();
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
      setFilteredDepartments([]);
    }
  };

  const fetchCreditAmounts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/course/credits`
      );
      const data = await response.json();
      setCreditAmounts(data);
    } catch (error) {
      console.error("Error fetching credits:", error);
      setCreditAmounts([]);
    }
  };

  return (
    <>
      <Stack sx={{ marginBottom: 2 }} direction="row">
        <Typography variant="h6">Filters</Typography>
        <Button
          variant="text"
          sx={{
            fontWeight: "bold",
            width: "25%",
            color: "primary.main",
            backgroundColor: "white",
            "&:hover": { backgroundColor: "primary.main", color: "white" },
          }}
          onClick={resetFilters}
        >
          Reset
        </Button>
      </Stack>

      <TextField
        label="Search by course title"
        variant="outlined"
        onChange={handleSearch}
        sx={{ width: "100%", marginBottom: 2, height: "3.5em" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "primary.main", height: "100%" }} />
            </InputAdornment>
          ),
        }}
      />
      <Box style={{ marginBottom: 20 }}>
        <Select
          value={selectedCredits}
          onChange={handleCreditsChange}
          displayEmpty
          style={{ width: "45%", height: "3.5em", marginRight: 10 }}
        >
          <MenuItem value="">Filter by Credits</MenuItem>
          {creditAmounts.map((num) => (
            <MenuItem key={num} value={num}>
              {num}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          displayEmpty
          style={{
            width: "100%",
            height: "3.5em",
            marginTop: 10,
            marginRight: 10,
          }}
        >
          <MenuItem value="">Filter by Department</MenuItem>
          <MenuItem>
            <TextField
              placeholder="Search departments..."
              variant="outlined"
              size="small"
              fullWidth
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();

                const searchValue = e.target.value.toLowerCase();
                if (!searchValue) {
                  fetchDepartments();
                } else {
                  const filteredDeps = departments.filter((dep) =>
                    dep.toLowerCase().includes(searchValue)
                  );
                  setFilteredDepartments(filteredDeps);
                }
                e.stopPropagation();
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onBlur={(e) => {
                e.stopPropagation();
                fetchDepartments();
              }}
            />
          </MenuItem>
          {filteredDepartments.map((dep) => (
            <MenuItem key={dep} value={dep}>
              {dep}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100% - 15em)",
        }}
      >
        <Box
          sx={{
            overflowY: "scroll",
            flexGrow: 1,
            marginBottom: 0,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none", // For Internet Explorer
            "scrollbar-width": "none", // For Firefox
          }}
        >
          <Stack spacing={2}>
            {loading ? (
              <CircularProgress />
            ) : (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}
          </Stack>
        </Box>
      </Box>

      <Box
        id="bottom-bar"
        sx={{
          borderRadius: 2,
          backgroundColor: "white",
          padding: "1em",
          paddingTop: "0",
          height: "2em",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            boundaryCount={1}
            size="small"
            siblingCount={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              // marginBottom: "1em",
              marginTop: "1em",
            }}
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    </>
  );
};

export default Search;
