import mongodb from 'mongodb';
import bcrypt from 'bcrypt';
const jwt  = require('jsonwebtoken');
import fs from 'fs';
require('dotenv').config({
    path: 'Env_Variables.env'
});

/* Mongo connection */
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGO_URI;
var privateKey = fs.readFileSync('private.key','utf8');


/**
 *
 *
 * @param {*} data.
 * @param {*} key.
 * @param {*} expiry.
 * generate the token.
 */
const jwtToken = (data,key,expiry) =>{
    return jwt.sign({data},key,{
        expiresIn: expiry,
    });
}

/**
 * Resolvers.
 */
const resolvers = {
    /**
     * Queries
     */
    Query: {
        getCurrentUser : async (_,args,currentUser) => {
            console.log('currentUser>>>>>>>>>',await currentUser.currentUser);
            if(!currentUser) return null;
            let client = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            let db = client.db(process.env.DB_NAME);
            console.log('before db call>>>>>>>..',currentUser.currentUser.userName)
            const user = await db.collection('User').findOne({userName : currentUser.currentUser.userName});
            console.log('user for current user>>>>>>>>',user);
            return user;

        },

        getUser: async (root,{}) => {
            let client = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            let db = client.db(process.env.DB_NAME);
            let res = await db.collection('User').find({}).toArray();
            console.log('res for getUsers>>>',res);
            return res;
        }
    },
    /**
     * Mutations
     */
    Mutation: {
        /**
         * @param {*} Register new User and insert the data to mongo db.
         * @param {*} {userName,password,gender,email,dob} user userName, password, gender, email, dob.
         */
        addUser: async (root, {userName,password,gender,email,dob}) => {
            console.log('uri', url);
            var hashedPassword;
            let client = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }); 
            let db = client.db(process.env.DB_NAME);
            const isUserExist = await db.collection('User').findOne({userName});
            if(isUserExist){
                throw new Error('User already Exist');
            }
            /**
             * Hashing the password.
             * generate the salt and then hash the password.
             */
            bcrypt.genSalt(10,(err,salt)=>{
                if(err) return err;
                bcrypt.hash(password,salt,async (err,hash)=>{
                    if(err) return err
                    password = hash;
                    let res = await db.collection('User').insertOne({userName,password,gender,email,dob});
                    return {res};
                })
            })
        },
        /**
         * @param {*} login user 
         * @param {*} {email,password} user email and password
         */
        signinUser : async(_,{email ,password})=>{
            let client = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }); 
            let db = client.db(process.env.DB_NAME);
            const user = await db.collection('User').findOne({email});
            if(!user){
                throw new Error('User not found!')
            }
            var userDataForTokenGeneration = {
                userName : user.userName,
                gender : user.gender,
                email : user.email,
                dob : user.dob
            }
            /**
            * Validate User Password.
            * if not throws error with "Invalid password".
            * generate token and return with token.
            */
            const isValidPassowrd = await bcrypt.compare(password,user.password);
            if(!isValidPassowrd){
                throw new Error('InValid password');
            }
            var token = jwtToken(userDataForTokenGeneration,privateKey,"120s");
            return {token};
        },
        /**
         * check for the duplicate username
         */
        checkValidUserName : async (_,{userName}) => {
            let client = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }); 
            let db = client.db(process.env.DB_NAME);
            let res = await db.collection('User').findOne({userName});
            console.log('isValidUserName>>>>>>',res);
            if(res){
                throw new Error(`Opps! UserName ${res.userName} already exists. Please try again.`)
            }
            return res;
        }
    }

}

export default resolvers;