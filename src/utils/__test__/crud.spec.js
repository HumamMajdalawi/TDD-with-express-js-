import {getOne,getMany,updateOne,createOne,removeOne} from '../crud'
import mongoose from 'mongoose'
import {List} from '../../resources/list/list.model'

describe('crud controllers',()=>{
    describe('getOne', async () => {
        test('find by authonticated user and id', async () => {
            expect.assertions(2)

            const user  = mongoose.Types.ObjectId()
            const list  = await List.create({name:'list',createdBy: user})

            const req = {
                params:{
                    id:list._id
                },
                user:{
                    _id: user
                }
            }

            const res = {
                status(status){
                    expect(status).toBe(200)
                    return this
                },
                json(result){
                    expect(result.data._id.toString()).toBe(list._id.toString())
                }
            }

            await getOne(List)(req,res)
        })
        
        test('404 if no doc found',async () => {
            expect.assertions(2)

            const user = mongoose.Types.ObjectId()
            const req = {
                params:{
                    id: mongoose.Types.ObjectId()
                },
                user:{
                    _id: user
                }
            }

            const res = {
                status(status){
                    expect(status).toBe(400)
                    return this
                },
                end(){
                    expect(true).toBe(true)
                }
            }

            await getOne(List)(req,res)
        })
    })
    describe('getMany', () => {
        test('finds array of docs by authenticated user', async () => {
          expect.assertions(4)

          const user = mongoose.Types.ObjectId()
          await List.create([
            { name: 'list', createdBy: user },
            { name: 'other', createdBy: user },
            { name: 'list', createdBy: mongoose.Types.ObjectId() }
          ])

          const req = {
            user: {
              _id: user
            }
          }

          const res = {
            status(status) {
              expect(status).toBe(200)
              return this
            },
            json(result) {
              expect(result.data).toHaveLength(2)
              result.data.forEach(doc => expect(`${doc.createdBy}`).toBe(`${user}`))
            }
          }

             await getMany(List)(req,res)
         })   

    })

    describe('createOne', () => {
        test('create a new doc', async () => {
            expect.assertions(2)

            const user = mongoose.Types.ObjectId()
            const body = {name: 'name',description:'description'}

            const req = {
                user: {_id:user},
                body
            }

            const res = {
                status(status){
                    expect(status).toBe(201)
                    return this
                },
                json(results){
                    expect(results.data.name).toBe(body.name)
                }
            }

            await createOne(List)(req,res)
        })
    })
    
    describe('updateOne', ()=> {
        test('finds doc by authenticated user and id to update', async () => {
            expect.assertions(3)
      
            const user = mongoose.Types.ObjectId()
            const list = await List.create({ name: 'name', createdBy: user })
            const update = { name: 'hello' }
      
            const req = {
              params: { id: list._id },
              user: { _id: user },
              body: update
            }
      
            const res = {
              status(status) {
                expect(status).toBe(200)
                return this
              },
              json(results) {
                expect(`${results.data._id}`).toBe(`${list._id}`)
                expect(results.data.name).toBe(update.name)
              }
            }
      
            await updateOne(List)(req, res)
          })
          
          test('400 if no doc', async () => {
              expect.assertions(2)

              const user = mongoose.Types.ObjectId
              const update = {name:'hello'}
              const req={
                  params:{id: mongoose.Types.ObjectId()},
                  user:{_id: user},
                  body: update
              }
              const res = {
                  status(status){
                      expect(status).toBe(400)
                      return this
                  },
                  end(){
                      expect(true).toBe(true)                }
              }

              updateOne(List)(req,res)
          })
    })        

    describe('removeOne', () => {
        test('find doc by authenticated user and remove it', async () => {
            expect.assertions(2)
            const user = mongoose.Types.ObjectId()
            const list = await List.create({name:'list',createdBy:user}) 
            const req = {
                params: {id: list._id},
                user: {_id: user}
            }

            const res = {
                status(status){
                    expect(status).toBe(200)
                    return this
                },
                json(results){
                    expect(`${results.data._id}`).toBe(`${list._id}`)
                }
            }

            await removeOne(List)(req,res)
        })

        test('400 if no doc', async () => {
            expect.assertions(2)
            const user = mongoose.Types.ObjectId()
            const req = {
                params: {id: mongoose.Types.ObjectId()},
                user: {_id: user}
            }
            const res = {
                status(status){
                    expect(status).toBe(400)
                    return this
                },
                end(){
                    expect(true).toBe(true)
                }
            }
            await removeOne(List)(req,res)
        })
    })
})
