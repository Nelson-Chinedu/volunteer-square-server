import { Router } from 'express';
import passport from 'passport';

import signupAuth from '../controllers/user/signup';
import verifyEmail from '../controllers/email/verifyEmail';

import validationMiddleware from '../middleware/validationMiddleware';
import checkEmailMiddleware from '../middleware/checkEmailMiddleware';
import verifyEmailMiddleware from '../middleware/verifyEmailMiddleware';

import signupValidation from '../validations/signupValidation';
import signinValidation from '../validations/signinValidation';

import signinAuth from '../auth/signin';

require('../auth/googleAuth');

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
  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  router.get(
    '/google/callback',
    passport.authenticate('google', {session: false, failureRedirect: '/login'}), (_req:any, res: any) => {
      res.redirect(`${process.env.CLIENT_URL}/app/dashboard`);
    }
  );
};
