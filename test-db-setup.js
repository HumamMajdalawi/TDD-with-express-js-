import mongoose from "mongoose"
import cuid from "cuid"
import _ from "lodash"
import {item} from "./src/resources/items/item.model"
import {List} from "./src/resources/list/list.model"
import {user} from "./src/resources/user/user.model"

const models = {item, List, user}

const url = 
            process.env.MONGODB_URI || process.env.DB_URI || 'mongodb://localhost:27017/tipe-devapi-testing'

global.newId = () => {return mongoose.Types.ObjectId()}

const remove = collection  => 
    new Promise((resolve,reject)=>{
        collection.remove(err =>{
            if(err) return reject(err)
            resolve()
        })
    })

beforeEach(async done =>{
    function clearDB(){
        return Promise.all(_.map(mongoose.connection.collections, c => remove(c)))
    }
    
    if(mongoose.connection.readyState === 0){
        try{
            const db = cuid()
            await mongoose.connect(url + db, { useNewUrlParser: true, autoIndex: true})
            await clearDB()
            await Promise.all(Object.keys(models).map(name => models[name].init()))
        }catch(e){
           // console.log(e)
            console.error(e)
            throw e
        }
    }else { 
       try{
        await clearDB()
       }catch(e){
           console.log(e);
       }
    }
 return done()
})

afterEach(async done =>{
    try{
 await mongoose.connection.db.dropDatabase()
 await mongoose.disconnect()
    }catch(e){
        console.error(e)
    }
 return done()    
})


afterAll(done => { return done()})