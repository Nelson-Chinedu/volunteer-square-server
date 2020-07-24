import winstonEnvLogger from 'winston-env-logger';

interface IArgs {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const validate =  {
  signUp: async (args: IArgs) =>{
    const { firstname, lastname, email, password } = args;

    try {
      if (firstname.length <= 0) {
        return {
          message: 'Firstname is Required'
        };
      }
      if (lastname.length <= 0) {
        return {
          message: 'Lastname is Required'
        };
      }
      if (email.length <= 0) {
        return {
          message: 'Email is Required'
        };
      }
      if (password.length <= 0) {
        return {
          message: 'Password is Required'
        };
      }
    } catch (error) {
      winstonEnvLogger.error({
        message: 'An error occured',
        error
      });
      throw new Error('An error occured');
    }
  },
  signIn: async (args: IArgs) => {
    const { email, password } = args;

    try {
      if (email.length <= 0) {
        return {
          message: 'Email Address is Required'
        };
      }
      if (password.length <= 0) {
        return {
          message: 'Password is Required'
        };
      }
    } catch (error) {
      winstonEnvLogger.error({
        message: 'An error occured',
        error
      });
      throw new Error('An error occured');
    }
  }
};

export default validate;