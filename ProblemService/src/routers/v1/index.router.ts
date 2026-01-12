import express from 'express';
import problemRouter from './problem.router';
import companyRouter from './company.router';
import explanationRouter from './explanation.router';

const v1Router = express.Router();

v1Router.use('/problem', problemRouter);
v1Router.use('/company', companyRouter);
v1Router.use('/explanation', explanationRouter);

v1Router.get('/health', (req, res) => {
    res.status(200).send('OK');
});

export default v1Router;