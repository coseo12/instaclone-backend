import { connect } from 'node:http2';
import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser, client }) => {
        let room = null;
        if (userId) {
          const user = await client.user.findUnique({
            where: { id: userId },
            select: { id: true },
          });
          if (!user) {
            return {
              ok: false,
              error: `This user does not exist`,
            };
          }
          room = await client.room.create({
            data: {
              users: {
                connect: [
                  {
                    id: userId,
                  },
                  {
                    id: loggedInUser.id,
                  },
                ],
              },
            },
          });
        } else if (roomId) {
          room = await client.room.findUnique({
            where: {
              id: roomId,
            },
            select: {
              id: true,
            },
          });

          if (!room) {
            return {
              ok: false,
              error: `Room not found`,
            };
          }
        }

        await client.message.create({
          data: {
            payload,
            room: {
              connect: {
                id: room.id,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });

        return {
          ok: true,
        };
      }
    ),
  },
};

export default resolvers;
