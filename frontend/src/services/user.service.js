import axios from './root.service.js';
import cookies from 'js-cookie';

export async function getUserProfile() {
    try {
        const token = cookies.get('jwt=auth');
        const response = await axios.get('/user/profile/private', {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
    
        return {
            success: true,
            data: response.data.data,
            message: response.data.message,
            token: token
        };
    } catch(error) {
        console.error('Error al obtener perfil del usuario: ', error);
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || 'Error al obtener el perfil del usuario',
        };
    }
}

/**
 * Actualizar usuario autenticado
 * @param {Object} data - Datos a actualizar (email. password)
 */
export async function updateUser(data){
    try {
        const token = cookies.get('jwt-auth');
        const response = await axios.patch('/user/profile/private', data,{
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });

        return{
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        console.error('Error al actualizar usuario: ', error);
        return{
            success: false,
            data: null,
            message: error.response?.data?.message || 'Error al actualizar el usuario',
        };
    }
}

/**
 * Eliminar usuasrio autenticado
 * @param {number} id - ID del usuario autenticado
 */
export async function deleteUser(id){
    try{
        const token = cookies.get('jwt-auth');
        const response = await axios.delete(`/user/profile/private/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return{
            success: true,
            data: response.data.data,
            message: response.data.message,
        };
    }catch(error){
        console.error('Error al eliminar usuario: ', error);
        return{
            success: false,
            data: null,
            message: error.response?.data?.message || 'Error al eliminar el usuario',
        };
    }
}