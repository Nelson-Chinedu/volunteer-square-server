import { body } from 'express-validator';

const signupValidation = [
  body('firstname')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Firstname is required'),
  body('lastname')
    .not()
    .isEmpty()
    .trim()
    .withMessage('Lastname is required'),
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
    .isLength({
      min: 8
    })
    .withMessage('Password must be more than 8 chars')
];

export default signupValidation;
