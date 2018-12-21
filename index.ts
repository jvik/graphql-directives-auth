import { ApolloServer, gql, makeExecutableSchema } from "apollo-server";
import AuthDirective from "./AuthDirective";
import queryResolvers from "./resolvers";
import express from "express";
import bodyParser from "body-parser";
import jwtDecode from "jwt-decode";

const app = express();

const addJWTUserToHeader = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (req.headers.authorization) {
    req.user = jwtDecode(authHeader);
  }
  next();
};

app.use(
  addJWTUserToHeader,
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
);

const typeDefs = gql`
  directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION

  enum Role {
    ADMIN
    USER
  }

  type User @auth(requires: USER) {
    name: String
    banned: Boolean @auth(requires: ADMIN)
  }

  type Query {
    users: [User]
  }
`;

const resolvers = {
  Query: queryResolvers,
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthDirective,
  },
});

const server = new ApolloServer({
  context: ({ req }) => ({ headers: req.headers }),
  schema,
  introspection: true,
  playground: true,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
