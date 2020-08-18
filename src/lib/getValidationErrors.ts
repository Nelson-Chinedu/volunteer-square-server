interface IError {
  param: string;
  msg: string;
}

interface IErrorMessage {
  [key: string]: string;
}

const getValidationErrors = (errors: IError[]) => {
  let prevProperty: string;
  const errorMessages: IErrorMessage = {};

  errors.filter((error: IError) => {
    if (error.param !== prevProperty){
      prevProperty = error.param;
      return error;
    }
  }).map((error: any) => {
    errorMessages[error.param] = error.msg;
  });
  return errorMessages;
};

export default getValidationErrors;
