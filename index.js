const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Book @cacheControl(maxAge: 100) { 
    title: String
    author: String
    nestedObject: Object     #<--- this nestedObject will break it 
  }

  type Query {
    books: Book
  }

  type Object { # @cacheControl(maxAge: 70) <-- caching for Book will only work with this
    test: Boolean
  }
`;

const books = 
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    nestedObject: {
      test: true
    }
  }
;
const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
