import jwt from 'jsonwebtoken';

export default async (user, secret, expiresIn) => {
  return await jwt.sign(user, secret, {expiresIn});
};
