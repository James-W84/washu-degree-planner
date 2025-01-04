# API Directory README

## Overview

This directory contains executable scripts that are essential for the functionality of the WashU Degree Planner API. Below is a detailed explanation of each script and its purpose.

## Scripts

### `serve`

- **Description**: This script starts the API server.
- **Usage**:

  ```
  npm run serve
  ```

### `populate-schools`

- **Description**: This script populates the database with the 5 schools based on the data.json file.
- **Usage**:

  ```
  npm run populate-schools
  ```

### `scrape-departments`

- **Description**: This script populates the database with all academic departments in the 5 schools from WebSTAC. It does not scrape the department identifier, e.g. CSE for Computer Science Department, which is done in the course scraping script.
- **Usage**:

  ```
  npm run scrape-departments
  ```

### `scrape-courses`

- **Description**: This script populates the database with all courses available during a given semester from WebSTAC. It also populates the database with the necessary attribute tags and creates the department identifier for each department. It does not scrape courses with variable credit hours.
- **Usage**:

  ```
  npm run scrape-courses [semester] [school]
  ```

  - **semester**: optional integer argument to specify the semester from which to scrape courses, 1-indexed. Value `1` is the most recently available semester (currently SP25), while `2` is the next most recent semester, and so on. Default value is `1`.
  - **school**: optional integer argument to specify which school to scrape courses from, of the 5 schools specified in the data.json file, 1-indexed. Value between 1 and 5, inclusive. Default is to scrape all 5 schools. Must specify **semester** argument to use this argument.

## Notes

- Ensure you have the necessary permissions to execute these scripts.
- Modify the scripts as needed to fit your environment and requirements.

## Contact

For any issues or questions, please contact the project maintainer.
