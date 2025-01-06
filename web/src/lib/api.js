import axios from "axios";

export const toggleSaveCourse = async (userId, courseId, save) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/course/save`,
      {
        userId,
        courseId,
        save,
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
};
