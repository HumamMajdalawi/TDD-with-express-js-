import {item} from "../item.model"
import mongoose from "mongoose"

describe("Item Model", ()=>{
    describe("schema", ()=> {
        test('name',()=>{
            const name = item.schema.obj.name
            console.log("name: " + name)
            expect(name).toEqual({
                type:String,
                required:true,
                trim:true,
                maxlength:50
            })
        })
      
        test("status",()=>{
            const status = item.schema.obj.status
            expect(status).toEqual({
                type:String,
                required: true,
                enum:["active","complete","postdue"],
                default: "active"
            })
        })

        test("notes",()=>{
            const notes = item.schema.obj.notes
            expect(notes).toEqual(String)
        })

        test("due",()=>{
            const due = item.schema.obj.due
            expect(due).toEqual(Date)
        })

        test("createdBy",()=>{
            const user = item.schema.obj.createdBy
            expect(user).toEqual({
                type:mongoose.SchemaTypes.ObjectId,
                ref:"user",
                required:true
            })
        })

        test("list",()=>{
            const list = item.schema.obj.list
            expect(list).toEqual({
                type:mongoose.SchemaTypes.ObjectId,
                ref: "list",
                required: true
            })
        })

    })
})