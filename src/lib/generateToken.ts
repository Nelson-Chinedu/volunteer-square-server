import jwt from 'jsonwebtoken';

export default async (user: any, secret: any, expiresIn: string) => {
  return await jwt.sign(user, secret, {expiresIn});
};
