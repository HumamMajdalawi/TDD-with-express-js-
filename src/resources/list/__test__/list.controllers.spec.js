import controllers from '../list.controllers'
import { isFunction } from 'lodash'

describe('Item controllers', () => {
  test('has crud controllers', () => {
    const crudMethods = [
      'getOne',
      'getMany',
      'createOne',
      'updateOne',
      'removeOne',
    ]

    crudMethods.forEach((method) =>
      expect(isFunction(controllers[method])).toBe(true)
    )
  })
})
