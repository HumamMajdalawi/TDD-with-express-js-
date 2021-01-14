import {Router} from "express"
import controllers from "./item.controllers"
import {validate} from './item.validator'

const router = Router()

router
      .route("/")
      .get(controllers.getMany)
      .post(validate("createItem"),controllers.createOne)  

router
     .route("/:id")
     .get(controllers.getOne)
     .put(validate("updateItem"),controllers.updateOne)
     .delete(controllers.removeOne)


export default router