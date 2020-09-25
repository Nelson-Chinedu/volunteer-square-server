import { Router } from 'express';

import signupAuth from '../controllers/user/signup';
import verifyEmail from '../controllers/email/verifyEmail';

import validationMiddleware from '../middleware/validationMiddleware';
import checkEmailMiddleware from '../middleware/checkEmailMiddleware';
import verifyEmailMiddleware from '../middleware/verifyEmailMiddleware';

import signupValidation from '../validations/signupValidation';
import signinValidation from '../validations/signinValidation';

import signinAuth from '../auth/signin';

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
};
