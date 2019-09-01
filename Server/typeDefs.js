import {gql} from 'apollo-server';
const typeDefs = gql `

type User{
    userName: String!,
    password: String!,
    confirmPassword: String!,
    gender: String,
    email:String!,
    dob:String,
}

type Mutation{
    addUser(userName: String!,password: String!,confirmPassword: String!,gender: String!,email: String!,dob: String!): User!
}

type Query{
    getUser: User!
}

`;


export default typeDefs