export default interface IContext {
  req: User;
  secret: string;
}

type User = {
  user: userPayload;
};

type userPayload = {
  id: string;
  email: string;
  accessToken: string;
};
