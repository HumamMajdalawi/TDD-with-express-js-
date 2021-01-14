import { body } from 'express-validator'

export function validate(method) {
  switch (method) {
    case 'createItem': {
      return [
        body('name', 'Item name is requried').exists(),
        body('list', 'list id is required').exists(),
        body('notes', 'Item notes is required').exists(),
        body('status').optional().isIn(['active', 'completed', 'postdate']),
      ]
    }
    case 'updateItem': {
      return [
        body('name', 'Item name is requried').exists(),
        body('list', 'list id is required').exists(),
        body('notes', 'Item notes is required').exists(),
        body('status').optional().isIn(['active', 'completed', 'postdate']),
      ]
    }
  }
}
