import * as bcrypt from 'bcrypt';
import { createWriteStream } from 'fs';
import { Resolvers } from '../../types';
import { protectedResolver } from '../users.utils';

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { loggedInUser, client }
      ) => {
        let avatarUrl = null;
        if (avatar) {
          const { filename, createReadStream } = await avatar;
          const newFileName = `${loggedInUser.id}-${Date.now()}-${filename}`;
          const readStream = createReadStream();
          const writeStream = createWriteStream(
            `${process.cwd()}/uploads/${newFileName}`
          );
          readStream.pipe(writeStream);
          avatarUrl = `http://localhost:4000/images/${newFileName}`;
        }

        let uglyPassword = null;
        if (newPassword) {
          uglyPassword = await bcrypt.hash(newPassword, 10);
        }

        const updateUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(avatarUrl && { avatar: avatarUrl }),
            ...(uglyPassword && { password: uglyPassword }),
          },
        });

        if (updateUser.id) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: 'Could not update profile',
          };
        }
      }
    ),
  },
};

export default resolvers;
