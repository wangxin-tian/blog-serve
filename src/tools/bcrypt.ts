import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export const encryption = function (pwd: string) {
  const salt = genSaltSync(10);
  // 对明文加密
  const hash = hashSync(pwd, salt);
  return hash;
};

export const verification = function (pwd: string, hash: string) {
  if (!pwd || !hash) return false;
  const isOk = compareSync(pwd, hash);
  return isOk;
};
