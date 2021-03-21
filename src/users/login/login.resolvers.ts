import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export default {
  Mutation: {
    login: async (_, { username, password }, { client }) => {
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: `User not found.`,
        };
      }

      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: `Incorrect password.`,
        };
      }

      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: '1d',
      });

      return {
        ok: true,
        token,
      };
      // issue a token and send it to the user
    },
  },
};
