export default async (email, {models}) => {
  return await models.Account.findOne({
    where: {
      email
    }
  })
}