import controllers from '../item.controllers'
import {isFunction} from "lodash"

describe('item controllers', () => {
  test('has crud controller', () => {
    const crudMethods = [
      'getOne',
      'getMany',
      'createOne',
      'removeOne',
      'updateOne',
    ]

    crudMethods.forEach((method) => expect(isFunction(controllers[method])).toBe(true))
  })
})
