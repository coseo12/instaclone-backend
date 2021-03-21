import { protectedResolver } from '../users.utils';

const unfollowUserFn = async (_, { username }, { loggedInUser, client }) => {
  const ok = await client.user.findUnique({
    where: { username },
    select: { id: true },
  });
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
