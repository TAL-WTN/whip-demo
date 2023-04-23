import {SignJWT} from 'jose';
const getToken = async (AppID: string, AppKey: string, StreamID: string, action: 'pub' | 'sub') => {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const privateKey = new TextEncoder().encode(AppKey);

  const payload: any = {
    version: "1.0",
    appID: AppID,
    streamID: StreamID,
    action,
    exp,
    enableSubAuth: true,
  };

  const token = await new SignJWT(payload).setProtectedHeader({
    alg: 'HS256',
    typ: "JWT",
  }).sign(privateKey);
  return token;
}
export default getToken
