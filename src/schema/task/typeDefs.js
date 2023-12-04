import gql from 'graphql-tag';

export default gql`
  enum TaskStatus {
    PENDING
    PROCESSING
    COMPLETED
  }

  enum TaskLabel {
    URGENT
    IMPORTANT
    WORK
    PERSONAL
    MEETINGS
    STANDBY
    PLANNING
    TRACKING
  }

  input CreateTaskInput {
    name: String!
    description: String!
    dueDate: String!
    status: TaskStatus
    label: TaskLabel
  }

  input UpdateTaskInput {
    name: String
    description: String
    dueDate: String
    status: TaskStatus
    label: TaskLabel
  }

  type Task {
    id: ID!
    name: String!
    description: String!
    dueDate: String!
    status: TaskStatus!
    createdAt: String!
    updatedAt: String!
    user: User!
    label: Label
  }

  extend type Query {
    tasks: [Task]!
    task(id: ID!): Task!
  }

  extend type Mutation {
    createTask(task: CreateTaskInput!): Task!
    updateTask(id: ID!, edits: UpdateTaskInput!): Task!
    deleteTask(id: ID!): String!
  }
`;
