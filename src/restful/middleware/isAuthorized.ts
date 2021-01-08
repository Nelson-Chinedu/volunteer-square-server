import {Response, NextFunction} from 'express';
import { respondWithWarning } from '../../lib/httpResponse';

const isAuthorized = (req: any, res: Response, next: NextFunction) => {
  if (!req.isAuthorized){
    return respondWithWarning(res, 403, 'Unauthorized access');
  }
  return next();
};

export default isAuthorized;
