const checkEmail = async (email: any, context:any) => {
 try {
  return await context.models.Account.findOne({
    where: {
      email
    }
  });
 } catch (error) {
   throw new Error(error);
 }
};

export default checkEmail;
