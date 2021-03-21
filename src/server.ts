require('dotenv').config();
import * as express from 'express';
import * as logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';
import client from './client';

const PORT = process.env.PORT;

const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.authorization),
      client,
    };
  },
});

const app = express();
app.use(logger('tiny'));
apollo.applyMiddleware({ app });
app.use('/images', express.static('uploads'));

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} ✅`);
});
