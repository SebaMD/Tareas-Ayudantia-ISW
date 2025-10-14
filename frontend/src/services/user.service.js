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
            message: error.response?.data?.message || 'Error al obtener el perfil del usaurio',
        };
    }
}