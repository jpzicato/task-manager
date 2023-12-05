import gql from 'graphql-tag';

export default gql`
  input CreateProjectInput {
    name: String!
    description: String!
    tasks: [ID!]
  }

  input UpdateProjectInput {
    name: String
    description: String
    tasks: [ID!]
  }

  type Project {
    name: String!
    description: String!
    user: User!
    tasks: [Task]!
  }

  extend type Query {
    projects: [Project]!
    project(id: ID!): Project!
  }

  extend type Mutation {
    createProject(project: CreateProjectInput!): Project!
    updateProject(id: ID!, edits: UpdateProjectInput!): Project!
    deleteProject(id: ID!): String!

    addTaskToProject(taskId: ID!, projectId: ID!): Project!
    removeTaskFromProject(taskId: ID!, projectId: ID!): Project!
  }
`;
