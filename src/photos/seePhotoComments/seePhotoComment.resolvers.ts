import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: (_, { id, lastId }, { client }) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        orderBy: {
          createdAt: 'desc',
        },
      }),
  },
};

export default resolvers;
