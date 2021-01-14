import { body } from 'express-validator'

export function validate(method) {
  switch (method) {
    case 'createList': {
      return [
        body('name', 'List name is requried').exists(),
        body('description', 'list description is required').exists(),
      ]
    }
    case 'updateList': {
      return [
        body('name', 'List name is requried').exists(),
        body('description', 'list description is required').exists(),
      ]
    }
  }
}
