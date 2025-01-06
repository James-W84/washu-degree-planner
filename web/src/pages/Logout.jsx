import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useSession();

  useEffect(() => {
    logout();
    navigate("/");
  }, []);

  return <Typography variant="h1">Logging out...</Typography>;
}

export default Logout;
