import client from '../../client';
import { protectedResolver } from '../users.utils';

const followUserFn = async (_, { username }, { loggedInUser }) => {
  const ok = await client.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!ok) {
    return {
      ok: false,
      error: `That user does not exist.`,
    };
  }
  await client.user.update({
    where: { id: loggedInUser.id },
    data: {
      following: {
        connect: {
          username,
        },
      },
    },
  });
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    followUser: protectedResolver(followUserFn),
  },
};
