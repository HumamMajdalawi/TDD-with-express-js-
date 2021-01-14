import {Router} from "express"
import listControllers from "./list.controllers"
import {validate} from './list.validtator'

const router =  Router()

router
    .route("/")
    .get(listControllers.getMany)
    .post(validate("createList"),listControllers.createOne)

router
    .route("/:id")
    .get(listControllers.getOne)
    .put(validate("updateList"),listControllers.updateOne)
    .delete(listControllers.removeOne)


export default router