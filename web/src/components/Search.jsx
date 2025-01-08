import React, { useEffect, useMemo, useState } from "react";
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
  ListSubheader,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CourseCard from "./CourseCard";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 25;

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    setPage(1);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearchText("");
    setSelectedDepartment("");
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      if (selectedDepartment) {
        params.append("department", selectedDepartment.id);
      }
      if (searchText) {
        params.append("search", searchText);
      }

      const response = await fetch(
        `${
          process.env.REACT_APP_API_ENDPOINT
        }/course/search?${params.toString()}`
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

  const handleDepartmentSearch = (event) => {
    setSearchDepartment(event.target.value);
  };

  const filteredDepartments = useMemo(() => {
    return searchDepartment
      ? departments.filter(
          (dep) =>
            dep.name.toLowerCase().includes(searchDepartment.toLowerCase()) ||
            dep.code.toLowerCase().includes(searchDepartment.toLowerCase())
        )
      : departments;
  }, [departments, searchDepartment]);

  useEffect(() => {
    fetchCourses();
  }, [page, selectedDepartment, searchText]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/course/departments`
      );
      const data = await response.json();

      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  return (
    <Stack direction={"column"} sx={{ height: "100%", margin: 0 }}>
      <Box style={{ marginBottom: 20 }}>
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
          label="Search by course title, course code, etc."
          variant="outlined"
          onChange={handleSearch}
          sx={{ width: "100%", height: "3em" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "primary.main", height: "100%" }} />
              </InputAdornment>
            ),
          }}
        />

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
          renderValue={(selected) => {
            return selected
              ? `${selected.name} (${selected.code})`
              : "Filter by Department";
          }}
        >
          <MenuItem value="">Filter by Department</MenuItem>
          <ListSubheader>
            <TextField
              autoFocus
              placeholder="Search departments..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchDepartment}
              onChange={handleDepartmentSearch}
              onKeyDown={(e) => e.stopPropagation()}
              onBlur={(e) => {
                e.stopPropagation();
                fetchDepartments();
              }}
            />
          </ListSubheader>
          {filteredDepartments.map((dept) => (
            <MenuItem key={dept.id} value={dept}>
              {`${dept.name} (${dept.code})`}
            </MenuItem>
          ))}
        </Select>
      </Box>
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
              marginTop: "1em",
            }}
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default Search;
