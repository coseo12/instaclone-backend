require('dotenv').config();
import * as http from 'http';
import * as express from 'express';
import * as logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';
import client from './client';

type Params = {
  Authorization?: String;
};

const PORT = process.env.PORT;

const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  uploads: false,
  context: async ctx => {
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.authorization),
        client,
      };
    } else {
      const {
        connection: { context },
      } = ctx;
      return {
        loggedInUser: context.loggedInUser,
        client,
      };
    }
  },
  subscriptions: {
    onConnect: async ({ Authorization }: Params) => {
      if (!Authorization) {
        throw new Error(`You can't listen`);
      }
      const loggedInUser = await getUser(Authorization);
      return {
        loggedInUser,
      };
    },
  },
});

const app = express();
app.use(graphqlUploadExpress());
app.use(logger('tiny'));
apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT }, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} ✅`);
});
