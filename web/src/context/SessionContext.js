import {
  useState,
  useEffect,
  useContext,
  createContext,
  useReducer,
} from "react";
import axios from "axios";

const SessionContext = createContext();

const emptySelection = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
};

const getEmptySelection = () => structuredClone(emptySelection);

export const SessionProvider = ({ children }) => {
  const initData = async (user) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/course/selected/${user.id}`
      );

      const copyOfEmptySelection = getEmptySelection();

      for (const userCourse of response.data) {
        copyOfEmptySelection[userCourse.semester].push(userCourse.course);
      }

      dispatch({ type: "INIT", payload: copyOfEmptySelection });
    } catch (error) {
      console.error(error);
    }
  };

  const selectCourse = async (courseId, semester) => {
    if (!isAuthenticated) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/course/select`, {
        userId: user.id,
        courseId,
        semester,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const unselectCourse = async (courseId) => {
    if (!isAuthenticated) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/course/unselect`,
        {
          userId: user.id,
          courseId,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const courseSelectionReducer = (state, action) => {
    switch (action.type) {
      case "INIT":
        return action.payload;
      case "CLEAR":
        return getEmptySelection();
      case "ADD": {
        const { course, semester } = action.payload;
        const newSemester = structuredClone(state[semester]);
        newSemester.push(course);
        selectCourse(course.id, semester);
        return { ...state, [semester]: newSemester };
      }
      case "DELETE": {
        const { course, semester } = action.payload;
        const newSemester = [...state[semester]].filter(
          (selected) => selected.id !== course.id
        );
        unselectCourse(course.id);
        return { ...state, [semester]: newSemester };
      }
      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const initializeUser = async () => {
    let storedUser = await sessionStorage.getItem("user");
    if (storedUser) {
      storedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUser(storedUser);
      initData(storedUser);
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [state, dispatch] = useReducer(
    courseSelectionReducer,
    getEmptySelection()
  );

  useEffect(() => {
    initializeUser();
  }, []);

  const login = async (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
    initData(dispatch, user);
  };

  const logout = async () => {
    sessionStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    dispatch({ type: "CLEAR" });
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        state,
        dispatch,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
