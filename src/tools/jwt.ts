import { JwtPayload, sign, verify } from 'jsonwebtoken';

const secret = 'MyBlog';
const expiresIn = 60 * 60 * 24 * 30;
// const expiresIn = 10;

export const generateToken = function (_id) {
  const payload = { _id };
  const token = sign(payload, secret, { expiresIn });
  return token;
};

interface Payload extends JwtPayload {
  _id: string;
}

export const verifyToken = function (token) {
  try {
    const payload = verify(token, secret) as Payload;
    return payload;
  } catch (error) {
    // console.log('无法解析token或者token超时');
    return false;
  }
};
