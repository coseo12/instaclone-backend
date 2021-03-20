import client from '../../client';
import { protectedResolver } from '../users.utils';

const unfollowUserFn = async (_, { username }, { loggedInUser }) => {
  const ok = await client.user.findUnique({ where: { username } });
  if (!ok) {
    return {
      ok: false,
      error: `Can't not unfollow user`,
    };
  }
  await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      following: {
        disconnect: {
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
    unfollowUser: protectedResolver(unfollowUserFn),
  },
};
