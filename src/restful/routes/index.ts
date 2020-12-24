import { Router } from 'express';
import passport from 'passport';

import signupAuth from '../controllers/user/signup';
import verifyEmail from '../controllers/email/verifyEmail';
import forgotPassword from '../controllers/user/forgotPassword';
import resetPassword from '../controllers/user/resetPassword';

import validationMiddleware from '../middleware/validationMiddleware';
import checkEmailMiddleware from '../middleware/checkEmailMiddleware';
import verifyEmailMiddleware from '../middleware/verifyEmailMiddleware';

import signupValidation from '../validations/signupValidation';
import signinValidation from '../validations/signinValidation';

import signinAuth from '../auth/signin';
import { createToken } from '../../lib/token';

require('../auth/googleAuth');
require('../auth/facebookAuth');

export default (router: Router) => {
  router.post(
    '/api/v1/signup',
    signupValidation,
    validationMiddleware,
    checkEmailMiddleware,
    signupAuth
  );
  router.post(
    '/api/v1/signin',
    signinValidation,
    validationMiddleware,
    signinAuth
  );
  router.post('/api/v1/verify-email/', verifyEmailMiddleware, verifyEmail);
  router.post('/api/v1/forgot-password', forgotPassword);
  router.post('/api/v1/reset-password', resetPassword);
  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  router.get(
    '/google/callback',
    passport.authenticate('google', {session: false, failureRedirect: '/login'}), (req:any, res: any) => {
      const {id} = req.user.account;
      const token = createToken(
        { id },
        process.env.JWT_KEY as string,
        '7d'
      );
      res.redirect(`${process.env.CLIENT_URL}/app/dashboard?token=${token}`);
    }
  );
  router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }), (req: any, res: any) => {
    const {id} = req.user.account;
    const token = createToken(
      { id },
      process.env.JWT_KEY as string,
      '7d'
    );
    res.redirect(`${process.env.CLIENT_URL}/app/dashboard?token=${token}`);
  });
};
