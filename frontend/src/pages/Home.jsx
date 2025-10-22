import { useState, useEffect } from "react";
import cookies from "js-cookie";
import {
  getUserProfile,
  updateUser,
  deleteUser,
} from "../services/user.service.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { deleteDataAlert } from "../helpers/sweetAlert.js";
import { logout } from "../services/auth.service.js";
import { showErrorAlert } from "../helpers/sweetAlert.js";

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = cookies.get("jwt-auth");
      if (!token) {
        navigate("/auth");
        return;
      }
    })();
  }, [navigate]);

  const handleGetProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setIsEditing(false);

    try {
      const result = await getUserProfile();
      if (result.success) {
        const tokenData = jwtDecode(cookies.get("jwt-auth"));
        const password = tokenData.password;
        const data = {
          id: result.data.id,
          email: result.data.email,
          password,
          created_at: result.data.created_at,
          updated_at: result.data.updated_at,
        };
        setProfileData(data);
      } else {
        setError(result.message);
        setProfileData(null);
      }
    } catch (error) {
      setError("Error inesperado al obtener el perfil");
      console.error("Get profile error:", error);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setFormData({
      email: profileData.email,
      password: "",
    });
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ email: "", password: "" });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const dataToUpdate = {
      email: formData.email,
    };
    if (formData.password) {
      dataToUpdate.password = formData.password;
    }

    try {
      const result = await updateUser(dataToUpdate);

      if (result.success) {
        setSuccess("Usuario actualizado exitosamente");
        setProfileData((prev) => ({
          ...prev,
          email: result.data.email,
          updated_at: result.data.updated_at,
          password: formData.password ? formData.password : prev.password,
        }));
        handleCancelEdit();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error inesperado al actualizar el usuario");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    deleteDataAlert(handleDelete);
  };

  const handleDelete = async () => {
    const userId = profileData.id;

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        setSuccess("Usuario eliminado exitosamente. Serás redirigido.");
        cookies.remove("jwt-auth");
        setProfileData(null);
        setIsEditing(false);

        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error inesperado al eliminar el usuario");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      cookies.remove("jwt-auth");
      navigate("/auth");
    } catch (error) {
      showErrorAlert("Error", error?.message || "No se pudo cerrar sesión.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4 ">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 w-full max-w-2xl transform transition-all hover:scale-105">
          {!profileData && (
            <h1 className="pb-2 text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Página de Inicio
            </h1>
          )}

          {error && !isEditing && (
            <div className="mb-4 text-red-600 font-semibold text-center p-3 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-green-600 font-semibold text-center p-3 bg-green-100 rounded-lg">
              {success}
            </div>
          )}

          {!profileData && (
            <div className="flex flex-col gap-4">
              <button
                onClick={handleGetProfile}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                disabled={loading}
              >
                {loading ? "Cargando perfil..." : "Obtener Perfil"}
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300"
                disabled={loading}
              >
                Cerrar Sesión
              </button>
            </div>
          )}

          {profileData && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Información del Usuario
              </h2>
              <div className="space-y-3">
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">ID de Usuario</p>
                  <p className="font-semibold text-gray-800">
                    {profileData.id}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="font-semibold text-gray-800">
                    {profileData.email}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Contraseña</p>
                  <p className="font-semibold text-gray-800">
                    {profileData.password}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  onClick={handleEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                  disabled={loading || isEditing}
                >
                  Editar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                  disabled={loading}
                >
                  Eliminar Cuenta
                </button>
              </div>

              <button
                onClick={() => {
                  setProfileData(null);
                  setIsEditing(false);
                }}
                className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Volver
              </button>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md transform transition-all hover:scale-105">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Editar Usuario
            </h2>

            {error && (
              <div className="mb-4 text-red-600 font-semibold text-center p-3 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña (opcional)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Dejar en blanco para no cambiar"
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
