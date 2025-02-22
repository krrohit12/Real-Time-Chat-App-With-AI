import {Router} from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/project.controller.js' 
import * as authMiddleWare from '../middleware/auth.middleware.js';

const router=Router();
router.post('/create',
    authMiddleWare.authUser,
    body('name').isString().withMessage('name is required'),
    projectController.createProject
)

router.get('/all',
    authMiddleWare.authUser,
    projectController.getAllProject
)
router.put('/add-user',
    authMiddleWare.authUser,
    body('projectId').isString().withMessage('Project id is required'),
    [
        body('users')
            .isArray()
            .withMessage('User field must be an array')
            .custom((users) => {
                if (!users.every((id) => typeof id === 'string')) {
                    throw new Error('Each user ID must be a string');
                }
                return true;
            })
    ],
    projectController.addUserToProject
)
router.get(
    '/get-project/:projectId',
    authMiddleWare.authUser,
    projectController.getProjectById
)
router.put('/update-file-tree',
    authMiddleWare.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    projectController.updateFileTree
)
export default router;