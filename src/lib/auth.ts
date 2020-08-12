import { Response } from 'express';

import generateToken from './generateToken';

import Account from '../db/entity/Account';

export const createAccessToken = (user: Account) => {
  return generateToken(
    { email: user.email, id: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    '15m'
  );
};

export const createRefreshToken = (user: Account) => {
  return generateToken(
    { email: user.email, id: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    '7d'
  );
};

export const sendRefreshToken = (res: Response, token:string) => {
  res.cookie('sotAmJViUg', token, {
    httpOnly: true,
  });
};
