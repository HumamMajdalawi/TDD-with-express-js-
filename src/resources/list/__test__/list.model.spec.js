import mongoose from 'mongoose'
import { List } from '../list.model'

describe('List Model', () => {
  describe('Schema', () => {
    test('name', () => {
      const name = List.schema.obj.name
      expect(name).toEqual({
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      })
    })

    test('description', () => {
      const description = List.schema.obj.description
      expect(description).toEqual(String)
    })

    test('createdBy', () => {
      const user = List.schema.obj.createdBy
      expect(user).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true,
      })
    })
  })
})
