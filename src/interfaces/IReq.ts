export default interface IReq {
  user: User;
}

type User = {
  id: string;
  email: string;
  accessToken: string;
};
