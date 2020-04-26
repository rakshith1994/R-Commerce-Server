import { ApolloServer , AuthenticationError } from 'apollo-server'
import resolvers from './resolvers';
import fs from 'fs';
const jwt  = require('jsonwebtoken');
import path from 'path';
import {initDb,getDb} from './database/db'


/**
 * Read the gql file.
 */
const filePath = path.join(__dirname,"typeDefs.gql");
const typeDefs = fs.readFileSync(filePath,"utf-8");
var privateKey = fs.readFileSync('private.key','utf8');

const getCurrentVerifiedUser = async token =>{
    if(token){
        try{
            let user = await jwt.verify(token,privateKey);
            console.log('user in token',user.data);
            return user.data;
        }
        catch(err){ 
            throw new AuthenticationError('Your session has ended. Please sign in again.')
        }
    }
}
/***
 * Apollo Server.
 */
const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError : (error) => {
        return {name : error.name,message : error.message}
    },
    context : async (request) => {
        var token = request.req.headers.authorization;
        return {currentUser : await getCurrentVerifiedUser(token)}
    }

});

initDb((err, db) => {
    if (err) {
        console.log(`error while connecting to mongoDB: ${err}`);
        return err;
    }
    server.listen(4000).then(({url})=>{
        console.log(`Listening on url ${url}`);
    })
})
