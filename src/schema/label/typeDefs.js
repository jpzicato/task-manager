import gql from 'graphql-tag';

export default gql`
  type Label {
    name: String!
    tasks: [Task]!
  }

  extend type Query {
    labels: [Label]!
    label(id: ID!): Label!
  }

  extend type Mutation {
    addTaskToLabel(labelId: ID!, taskId: ID!): Label!
    updateTaskFromLabel(labelId: ID!, taskId: ID!): Label!
    removeTaskFromLabel(taskId: ID!): String!
  }
`;
