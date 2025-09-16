"use strict";

import {
  updateUserService,
  deleteUserService,
} from "../services/user.service.js";

import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

  export async function updateUserById(req, res) {
    try {
      const userId = req.user.sub;//de esta forma se extrae la id del token
      const { email, password } = req.body;

      const updateUser = await updateUserService(userId, {email, password});

      if (!updateUser) {
        return handleErrorClient(res, 404, "Usuario no encontrado.");
      }

      handleSuccess(res, 200, "Usuario actualizado exitosamente exitosamente", updateUser);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener el Usuario", error.message);
    }
  }


  export async function deleteUserById(req, res) {
    try {
      const userId = req.user.sub;
      const deleteUser = await deleteUserService(userId);

      if (!deleteUser) {
        return handleErrorClient(res, 404, "Usuario no encontrado.");
      }

      handleSuccess(res, 200, "Usuario eliminado exitosamente exitosamente", {id: userId});
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener el Usuario", error.message);
    }
  }

