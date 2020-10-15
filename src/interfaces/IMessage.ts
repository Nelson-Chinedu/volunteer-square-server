export default interface IMessage {
  name: string;
  body: string;
  verificationLink?: string;
  route?: string;
  query?: string;
}
