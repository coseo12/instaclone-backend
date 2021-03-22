import { Resolvers } from '../types';

const resolvers: Resolvers = {
  User: {
    totalFollowing: async ({ id }, _, { client }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    totalFollowers: async ({ id }, _, { client }) =>
      client.user.count({ where: { following: { some: { id } } } }),
    isMe: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, _, { loggedInUser, client }) => {
      if (!loggedInUser) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: { id },
          },
        },
      });
      return exists !== 0;
    },
    photos: async ({ id }, { page }, { client }) =>
      client.user
        .findUnique({ where: { id } })
        .photos({ skip: (page - 1) * 5, take: 5 }),
  },
};

export default resolvers;
