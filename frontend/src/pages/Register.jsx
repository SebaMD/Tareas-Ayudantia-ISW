import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth.service.js";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await register(formData);
    setLoading(false);

    if (response.status === "success") {
      setMessage("Usuario registrado exitosamente ✅");
      setTimeout(() => navigate("/auth"), 2000); // Redirige al login en 2s
    } else {
      setMessage(response.message || "Error al registrar el usuario ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md transform transition-all hover:scale-105">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-bold text-center leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-8 -mt-2">
            Regístrate
          </h1>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="usuario@ejemplo.com"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="**********"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          {message && (
            <p className="text-center text-sm font-semibold mt-4 text-gray-700">
              {message}
            </p>
          )}

          <p className="text-center text-gray-600 text-sm mt-6">
            ¿Ya tienes una cuenta?{" "}
            <span
              onClick={() => navigate("/auth")}
              className="text-purple-600 font-semibold hover:underline cursor-pointer"
            >
              Inicia sesión aquí
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
