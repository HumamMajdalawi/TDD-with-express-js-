import config from '../config'
import { user as User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = (user) => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  })
}

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' })
  }

  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    return res.status(500).end()
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' })
  }

  const invalid = { message: 'Invalid email and passoword combination' }

  try {
    const user = await User.findOne({ email: req.body.email })
      .select('_id email password')
      .exec()

    if (!user) {
      return res.status(401).send(invalid)
    }

    const match = await user.checkPassword(req.body.password)

    if (!match) {
      return res.status(401).send(invalid)
    }

    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export const protect = async (req, res, next) => {
  let bearer = req.headers['authorization']
  if (!bearer) {
    return res.status(401).end()
  }

  const token = bearer.split(' ')[1]
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    console.log('error: ' + e)
    return res.status(401).end()
  }

  const user = await User.findById(payload.id).select('-password').lean().exec()

  if (!user) {
    return res.status(401).end()
  }

  req.user = user
  next()
}
