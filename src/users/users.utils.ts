import * as jwt from 'jsonwebtoken';
import { Context, Resolver } from '../types';
import client from '../client';

type VerifiedToken = {
  id: string;
};

export const getUser = async token => {
  try {
    if (!token) {
      return null;
    }
    const { id } = (await jwt.verify(
      token,
      process.env.SECRET_KEY
    )) as VerifiedToken;

    const user = await client.user.findUnique({
      where: { id: Number(id) },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const protectedResolver = (ourResolver: Resolver) => (
  root,
  args,
  context: Context,
  info
) => {
  if (!context.loggedInUser) {
    return {
      ok: false,
      error: 'Please log in to perform this action.',
    };
  }
  return ourResolver(root, args, context, info);
};
