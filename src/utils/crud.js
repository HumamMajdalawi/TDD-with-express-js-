import { validationResult } from 'express-validator'

export const getOne = (model) => async (req, res) => {
  try {
    const doc = await model
      .findOne({ createdBy: req.user._id, _id: req.params.id })
      .lean()
      .exec()
    if (!doc) {
      return res.status(400).end()
    }
    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getMany = (model) => async (req, res) => {
  try {
    const docs = await model.find({ createdBy: req.user._id }).lean().exec()

    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    return res.status(400).end()
  }
}


export const createOne = (model) => async (req, res) => {
  const createdBy = req.user._id
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const doc = await model.create({ ...req.body, createdBy })
    return res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    return res.status(400).end()
  }
}

export const updateOne = (model) => async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const updatedDoc = await model
      .findOneAndUpdate(
        {
          createdBy: req.user._id,
          _id: req.params.id
        },
        req.body,
        { new: true }
      )
      .lean()
      .exec()

    if (!updatedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const removeOne = (model) => async (req, res) => {
  try {
    const doc = await model.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id,
    })
    if (!doc) {
      return res.status(400).end()
    }
     return res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    return res.status(400).end()
  }
}

export const crudControllers = (model) => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model),
})
