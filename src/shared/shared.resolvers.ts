import { Resolvers } from '../types';
import { GraphQLUpload } from 'graphql-upload';

const resolvers: Resolvers = {
  Upload: GraphQLUpload,
};

export default resolvers;
