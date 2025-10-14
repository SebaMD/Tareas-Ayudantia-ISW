import { logout } from "@services/auth.service";
import { useNavigate } from "react-router-dom";
import { showErrorAlert } from "@helpers/sweetAlert";
import { useEffect } from "react";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await logout();
        navigate('')
      } catch (error) {
        showErrorAlert("Error", error?.message || "No se pudo cerrar sesión.");
      } finally {
        navigate("/auth");
      }
    })();
  }, []);
};

export default Logout;