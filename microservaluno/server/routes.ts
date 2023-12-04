import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router';
import alunoRouter from './api/controllers/aluno/router'
import faculdadeRouter from './api/controllers/faculdade/router'

export default function routes(app: Application): void {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/aluno', alunoRouter);
  app.use('/api/v1/faculdade', faculdadeRouter);
}
