import { body } from 'express-validator';

const signinValidation = [
  body('email')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Email address is required')
    .isEmail()
    .normalizeEmail({
      all_lowercase: true
    })
    .withMessage('Please enter a valid email address'),
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
];

export default signinValidation;
