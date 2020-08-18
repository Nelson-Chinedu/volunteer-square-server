import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import getValidationErrors from '../../lib/getValidationErrors';
import { respondWithWarning } from '../../lib/httpResponse';

const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = getValidationErrors(validationResult(req).array());

  if (Object.keys(errors).length) {
    return respondWithWarning(res, 400, 'Validation Error', errors);
  }
  return next();
};

export default validationMiddleware;
