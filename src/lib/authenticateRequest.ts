const authenticateUser = (decoded: any, req: any) => {
  req.isAuthorized = true;
  req.decoded = decoded;
};

export default authenticateUser;