import express from 'express';
import { submissionControllers } from '../../controllers/submission.controller';
import { validateRequestParams, validateRequestBody } from '../../validators';
import { createSubmissionSchema, findByIdSchema, findByUserAndProblemIdSchema, findByUserIdSchema, updateSubmissionSchema } from '../../validators/submission.validator';

const submissionRouter = express.Router();

submissionRouter.post('/', validateRequestBody(createSubmissionSchema), submissionControllers.create);
submissionRouter.get('/:id', validateRequestParams(findByIdSchema), submissionControllers.findById);
submissionRouter.get('/user/:userId', validateRequestParams(findByUserIdSchema), submissionControllers.findByUserId);
submissionRouter.get('/user/:userId/:problemId', validateRequestParams(findByUserAndProblemIdSchema), submissionControllers.findByUserAndProblemId);
submissionRouter.put('/:id', validateRequestBody(updateSubmissionSchema), submissionControllers.update);
submissionRouter.delete('/:id', validateRequestParams(findByIdSchema), submissionControllers.deleteById);
submissionRouter.get('/problem/:id', validateRequestParams(findByIdSchema), submissionControllers.findByProblemId);

submissionRouter.get('/health', (req, res) => {
    res.status(200).send('OK');
});

export default submissionRouter;