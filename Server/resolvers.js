import mongodb from 'mongodb';
require('dotenv').config({path:'Env_Variables.env'});

const MongoClient = mongodb.MongoClient;
const url = process.env.MONGO_URI;
const resolvers = {
    Query:{
        getUser: (root,args)=>{
            
        }
    },
    Mutation:{
        addUser: async (root,{ userName,
            password,
            confirmPassword,
            gender,
            email,
            dob})=>{
                console.log('uri',url);
            let client = await MongoClient.connect(url,{ useNewUrlParser: true,useUnifiedTopology: true });
            let db = client.db(process.env.DB_NAME);
            let  res = await db.collection('User').insertOne({
            userName,
            password,
            confirmPassword,
            gender,
            email,
            dob
            });
            return res.ops[0];

        }
    }
};

export default resolvers;