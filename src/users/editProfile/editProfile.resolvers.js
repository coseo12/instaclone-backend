import client from '../../client';
import bcrypt from 'bcrypt';
import { createWriteStream } from 'fs';
import { protectedResolver } from '../users.utils';

console.log(process.cwd());

const editProfileFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  const { filename, createReadStream } = await avatar;
  const readStream = createReadStream();
  const writeStream = createWriteStream(`${process.cwd()}/uploads/${filename}`);
  readStream.pipe(writeStream);

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
};

export default {
  Mutation: {
    editProfile: protectedResolver(editProfileFn),
  },
};