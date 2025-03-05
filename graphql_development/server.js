const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { gql } = require('graphql-tag');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

// Загружаем данные
const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'xxx.json')));

// Определяем схему GraphQL
const typeDefs = gql`
  type Xxx {
    id: ID!
    name: String!
    price: Int!
    description: String
  }

  type Query {
    products(id: ID): [Xxx]   # Аргумент 'id' добавлен в Query
  }
`;

// Определяем резолверы
const resolvers = {
  Query: {
    products: (_, { id }) => {
      if (id) {
        return productsData.filter(product => product.id === id);  // Фильтрация по id
      }
      return productsData;  // Если id не передан, возвращаем все товары
    }
  }
};

// Создаём Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Запускаем сервер Apollo и Express
async function startServer() {
  await server.start();
  app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`🚀 Apollo Server запущен на http://localhost:${PORT}/graphql`);
  });
}

startServer();
