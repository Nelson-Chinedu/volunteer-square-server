import checkEmail from './checkEmail';

export default async (email: string) => {
  const userEmail = await checkEmail(email);
  return userEmail;
};
