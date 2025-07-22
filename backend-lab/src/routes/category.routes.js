import express from 'express';
import * as categoryController from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createNewCategory);
router.put('/', categoryController.updateCategory);
router.delete('/', categoryController.deleteCategory);


export default router;