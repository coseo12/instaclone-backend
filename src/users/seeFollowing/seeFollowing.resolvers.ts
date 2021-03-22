import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, lastId }, { client }) => {
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: `User not found`,
        };
      }
      const following = await client.user
        .findUnique({ where: { username } })
        .following({
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });

      const totalFollowing = await client.user.count({
        where: { followers: { some: { username } } },
      });

      return {
        ok: true,
        following,
        totalPages: Math.ceil(totalFollowing / 5),
      };
    },
  },
};

export default resolvers;
