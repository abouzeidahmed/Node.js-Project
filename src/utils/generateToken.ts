import jwt from 'jsonwebtoken';

const JWT_SECRET = 'a7N#sL9^u3W%vD2*kP1b!TzY@Mq4&Xc6'; // secure hardcoded secret

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;

