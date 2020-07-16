import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  const salt = 10;
  return await bcrypt.hash(password, salt);
};

export const isValidPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}