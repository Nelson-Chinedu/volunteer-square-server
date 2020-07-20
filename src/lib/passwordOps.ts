import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const salt = 10;
  return await bcrypt.hash(password, salt);
};

export const isValidPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};
