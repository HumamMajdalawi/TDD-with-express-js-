import express from "express"
import {json, urlencoded} from "body-parser"
import morgan from "morgan"
import cors from "cors"
import itemRouter from "./resources/items/item.router"
import listRouter from "./resources/list/list.router"
import userRouter from "./resources/user/user.router"
import { connect } from './utils/db'
import config from './config'
import { signup, signin, protect } from './utils/auth'
const  expressValidator = require( 'express-validator')

export const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({extended:true}))
app.use(morgan("dev"))
// app.use(expressValidator())

app.post("/signup",signup)
app.post("/signin",signin)

app.use("/api",protect)
app.use("/api/item",itemRouter)
app.use("/api/list",listRouter)
app.use("/api/user",userRouter)

export const start = async () => {  
  try {
       await connect()
      app.listen(config.port, () => {
        console.log(`REST API on http://localhost:3000/api`)
      })
    } catch (e) {
      console.error(e)
    }
  }
