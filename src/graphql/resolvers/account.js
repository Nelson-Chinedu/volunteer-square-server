import {v4 as uuidv4} from 'uuid';

import checkEmail from '../../lib/checkEmail';
import generateToken from '../../lib/generateToken';
import { hashPassword, isValidPassword } from '../../lib/passwordOps';
import validate from '../../lib/validate';

export default {
  Query: {
    user: async (parent, args, {models}) => {
      return await models.Accounts.findByPk(1)
    }
  },
  Mutation: {
    account: async (parent, args, {secret, models}) => {
      const { firstname, lastname, email, password } = args;
     
      const userInput = await validate.signUp(args);
      
      if (userInput) {
        let {message} = userInput;
        if (message){
          return {
            token: '',
            message
          }
        }
      }

      const checkUserEmail = await checkEmail(email, {models});
      
      if (checkUserEmail && checkUserEmail.isNewRecord === false){
        return {
          token: '',
          message: 'Email address already exist'
        }
      }
      
      const hashedPassword = await hashPassword(password);

      const profile = await models.Profile.create({
        id: uuidv4(),
        firstname,
        lastname,
      });

      const user = await models.Account.create({
        id: uuidv4(),
        firstname,
        lastname,
        email,
        blocked: false,
        verified: false,
        password:hashedPassword,
        profileId: profile.id
      });
   
      return {
        token: generateToken({firstname,lastname,email}, secret , '15m'),
        message: 'Account created successfully'
      }
    },
    signin: async (parent, args, { secret, models }) => {
      const { email, password } = args;

      const userInput = await validate.signIn(args);

      if (userInput) {
        let {message} = userInput;
        if (message){
          return {
            token: '',
            message
          }
        }
      }

      const checkUserEmail = await checkEmail(email, {models});

      if (!checkUserEmail){
        return {
          token: '',
          message: 'User not found'
        }
      }
      const { dataValues } = checkUserEmail;
      const checkPassword = await isValidPassword(password, dataValues.password );
      
      if (!checkPassword) {
        return {
          token: '',
          message: 'User not found'
        }
      }
      
      return {
        token: generateToken({ email, id:dataValues.id}, secret , '15m'),
        message: 'Logged in successfully'
      }
    }
  }
}