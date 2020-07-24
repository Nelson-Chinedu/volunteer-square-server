import { Account } from '../db';

const checkEmail = async (email: string) => {
  try {
    return await Account.findOne({
      where: {
        email
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

export default checkEmail;
