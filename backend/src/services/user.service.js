import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}

export async function getUserService({ id }) {
  try {
    const user = await userRepository.findOne({
      where: { id },
      attributes: ["id", "email", "password","created_at", "updated_at"],
    });

    if(!user) {
      throw new Error("Credenciales incorrectas");
    }

    return [user, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function updateUserService(id, data) {
  const user = await userRepository.findOne({ where: { id } });
  if (!user) {
    throw new Error("Credenciales incorrectas"); 
  }

  if(data.email) {
    user.email = data.email;
  }
  
  if(data.password) {
    user.password = await bcrypt.hash(data.password, 10)
  } 

  const updateUser = await userRepository.save(user);

  return updateUser;
}

export async function deleteUserService(id) {
  try {  
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error("Credenciales incorrectas"); 
    }

    await userRepository.remove(user);
    return [user, null];
  }catch(error) { 
    return [null, error.message];
  }
}