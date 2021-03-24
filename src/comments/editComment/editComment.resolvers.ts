import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';
import resovlers from '../comments.resolvers';

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload }, { loggedInUser, client }) => {
        const comment = await client.comment.findUnique({
          where: { id },
          select: {
            userId: true,
          },
        });
        console.log(comment);
        if (!comment) {
          return {
            ok: false,
            error: `Comment not found`,
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: `Not authorized`,
          };
        } else {
          await client.comment.update({
            where: {
              id,
            },
            data: {
              payload,
            },
          });
        }

        return {
          ok: true,
        };
      }
    ),
  },
};

export default resolvers;
