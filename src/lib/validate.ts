interface IArgs {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const validate =  {
  signUp: async (args: IArgs) =>{
    const { firstname, lastname, email, password } = args;
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
  },
  signIn: async (args: IArgs) => {
    const { email, password } = args;
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
  }
};

export default validate;