import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Movie {
    id: Int
    title: String
    year: Int
    createdAt: DateTime
    updatedAt: DateTime
  }
  type Query {
    movies: [Movie]
    movie: Movie
  }
  type Mutation {
    createMovie(title: String!): Boolean
    deleteMovie(title: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    movies: () => [{ id: 1, title: 'Hello', year: 2021 }],
    movie: () => ({ id: 1, title: 'Hello', year: 2021 }),
  },
  Mutation: {
    createMovie: (_, { title }) => {
      console.log(title);
      return true;
    },
    deleteMovie: (_, { title }) => {
      console.log(title);
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(() => console.log('Server is running on http://localhost:4000/'));
