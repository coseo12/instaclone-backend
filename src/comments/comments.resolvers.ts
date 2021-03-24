import { Resolvers } from '../types';

const resovlers: Resolvers = {
  Comment: {
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
  },
};

export default resovlers;
