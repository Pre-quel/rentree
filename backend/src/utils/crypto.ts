import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashEditCode = async (editCode: string): Promise<string> => {
  return bcrypt.hash(editCode, SALT_ROUNDS);
};

export const verifyEditCode = async (plainEditCode: string, hashedEditCode: string): Promise<boolean> => {
  return bcrypt.compare(plainEditCode, hashedEditCode);
};