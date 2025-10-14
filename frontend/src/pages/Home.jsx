import { useState } from "react";
import cookies from "js-cookie";
import { getUserProfile } from "../services/user.service.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = cookies.get("jwt-auth");

      if (!token) {
        navigate("/auth");

        return;
      }
    })();
  }, []);

  const handleGetProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getUserProfile();

      if (result.success) {
        const tokenData = jwtDecode(cookies.get("jwt-auth"));
        const password = tokenData.password;

        const data = {
          id: result.data.id, 
          email: result.data.email, 
          password, created_at: result.data.created_at, updated_at:result.data.updated_at
        }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transform transition-all hover:scale-105">
        {!profileData && (
          <h1 className="pb-2 text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Página de Inicio
          </h1>
        )}
        {error && (
          <div className="mb-4 text-red-600 font-semibold text-center">
            {error}
          </div>
        )}

        {!profileData && (
          <button
            onClick={handleGetProfile}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
            disabled={loading}
          >
            {loading ? "Cargando perfil..." : "Obtener Perfil"}
          </button>
        )}

        {profileData && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Información del Usuario
            </h2>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">ID de Usuario</p>
                <p className="font-semibold text-gray-800">{profileData.id}</p>
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

              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Creado</p>
                <p className="font-semibold text-gray-800">
                  {profileData.created_at}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Actualizado</p>
                <p className="font-semibold text-gray-800">
                  {profileData.updated_at}
                </p>
              </div>
            </div>

            <button
              onClick={() => setProfileData(null)}
              className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            >
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
