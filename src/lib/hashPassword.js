import bcrypt from 'bcrypt';

export default async (password) => {
  const salt = 10;
  return await bcrypt.hash(password, salt);
};