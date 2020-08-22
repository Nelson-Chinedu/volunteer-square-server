const getContactError = (args: any) => {
  const { name, address, telephone } = args;
  if (name.length <= 0) {
    return {
      message: 'Name is required',
    };
  }
  if (address.length <= 0) {
    return {
      message: 'Address is required',
    };
  }
  if (telephone.length <= 0) {
    return {
      message: 'Phone number is required',
    };
  }
};

export default getContactError;
