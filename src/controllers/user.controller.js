"use strict";

import {
  updateUserService,
  deleteUserService,
  getUserService,
} from "../services/user.service.js";

import {
  userBodyValidation,
  userQueryValidation,
} from "../validations/usuario.validation.js";

import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

  export async function getUserById(req, res) {
    try {

      const tokenUserId = req.user.sub;
      const numericId = Number(req.params.id);

      const { error } = userQueryValidation.validate({ id:numericId });

      if (error) {
        return handleErrorClient(res, 400, "Parametros de consulta invalidos.", error.message);
      }

      if (numericId !== tokenUserId) {
        return handleErrorClient(res, 403, "No tienes permiso para ver los datos de otro usuario.");
      }

      const [user, errorUser] = await getUserService({ id:numericId });

      if (errorUser){
        return handleErrorClient(res, 404, "Error al obtener el Usuario", errorUser);
      }

      const {password, ...userData} = user;
      const orderedUser = {
        id: userData.id,
        email: userData.email,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      };

      handleSuccess(res, 200, "Usuario encontrado", orderedUser);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener el Usuario", error.message);
    }
  }

  export async function updateUserById(req, res) {
    try {
      const userId = req.user.sub;
      const { email, password } = req.body;
      const { error } = userBodyValidation.validate(req.body);

      if (error) {
        return handleErrorClient(res, 400, "Parametros de entrada invalidos.", error. message);
      }

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

