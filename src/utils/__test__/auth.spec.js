import {newToken, verifyToken, signup, signin, protect} from '../auth'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import config from '../../config'
import {user as User} from '../../resources/user/user.model'

describe('Authentication', () => {
    describe('newToken', () => {
        test('create a new token', () => {
            const id = 1
            const token =  newToken({id})
            const user =  jwt.verify(token, config.secrets.jwt)
            expect(user.id).toBe(id)
        })
    })

    describe('verifyToken', ()=> {
        test('validate jwt token and returns payload', async () => {
            const id = 1234
            const token = jwt.sign({id},config.secrets.jwt)
            const user = await verifyToken(token)
            expect(user.id).toBe(id)

        })
    })

    describe('signup', () => {
        test('require email and password', async () => {
            expect.assertions(2)
            const req = {body:{}}
            const res = {
                status(status){
                    expect(status).toBe(400)
                    return this
                },
                send(results){
                    expect(typeof results.message).toBe('string')
                }
            }

            await signup(req,res)
        })
    
    
      test('creates user and sends new token from user', async () => {
          expect.assertions(2)

          const req = {
              body: {email: 'test@test2.com', password: '1234556'}
          }
          const res = {
              status(status){
                  expect(status).toBe(201)
                  return this
              },
              async send(result){
                  let user = await verifyToken(result.token)
                  user = await User.findById(user.id)
                                   .lean()
                                   .exec()
                  expect(user.email).toBe(req.body.email) 
              }
          }

          await signup(req,res)
      })  
    })

    describe('signin', () => {
        test('requires email and password', async () => {
            expect.assertions(2)
            const req = {body:{}}
            const res = {
                status(status){
                    expect(status).toBe(400)
                    return this
                },
                send(result){
                    expect(typeof result.message).toBe('string')
                }
            }

            await signin(req,res)
        })

        test('user must be real', async() => {
            expect.assertions(2)
            const req = {body:{email:'test@test2.com', password:'123456'}}
            const res = {
                status(status){
                    expect(status).toBe(401)
                    return this
                },
                send(result){
                    expect(typeof result.message).toBe('string')
                }
            }

            await signin(req,res)
        })

        test('password must match', async () => {
            expect.assertions(2)
            await User.create({
                email:'test@test2.com',
                password:'123456'
            })
            const req = {body:{email:'test@test2.com',password:'1234555'}}
            const res = {
                status(status){
                    expect(status).toBe(401)
                    return this
                },
                send(result){
                    expect(typeof result.message).toBe('string')
                }
            }
                await signin(req,res)
        })

        test('create new token', async () => {
            expect.assertions(2)
            const fields =  {
                email: 'test@test2.com',
                password: '123456'
            }
            const savedUser = await User.create(fields)
            const req = {body:fields}
            const res = {
                status(status){
                    expect(status).toBe(201)
                    return this
                },
                async send(result){
                    let user = await verifyToken(result.token)
                    user = await User.findById(user.id)
                    .lean()
                    .exec()
                    expect(user._id.toString()).toBe(savedUser._id.toString()) 
                }
            }

            await signin(req,res)
        })

    })

  
    describe('protect', () => {
        test('looks for Bearer token in headers', async () => {
            expect.assertions(2)

            const req = {headers:{}}
            const res = {
                status(status){
                    expect(status).toBe(401)
                    return this
                },
                end(){
                    expect(true).toBe(true)
                }
            }
            await protect(req,res)
        })

        test('token must have correct prefix', async () => {
            expect.assertions(2)

            const req = {headers:{authorization: newToken({id:123})}}
            const res = {
                status(status){
                    expect(status).toBe(401)
                    return this
                },
                end(){
                    expect(true).toBe(true)
                }
            }

            await protect(req,res)
        })

        test('must be a real user', async ()=>{
           expect.assertions(2)
            const token = `Bearer ${newToken({id: mongoose.Types.ObjectId()})}`
            const req = {headers:{authorization:token}}
            const res = {
                status(status){
                    expect(status).toBe(401)
                    return this
                },
                end(){
                    expect(true).toBe(true)
                }
            }

            await protect(req,res)
        })

        test('finds user from token and passes on', async () => {
            const user = await User.create({
                email:'test@test2.com',
                password:'123456'
            })
            const token = `Bearer ${newToken({id:user._id})}`
            const req = {headers:{authorization:token}}
            const next = () => {}
            await protect(req,{},next)
            expect(req.user._id.toString()).toBe(user._id.toString())
            expect(req.user).not.toHaveProperty('password')
        })
    })
})