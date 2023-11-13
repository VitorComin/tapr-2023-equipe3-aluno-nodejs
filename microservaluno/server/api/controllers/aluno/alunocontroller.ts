import { Request, Response } from 'express'
import AlunoService from '../../services/aluno.service';

export class AlunoController{
    all(_:Request, res:Response): void{
        AlunoService.all().then((r) => res.json(r));
    }
    getById(req: Request, res: Response): void {
        AlunoService.getById(req.params['id']).then((r) => res.json(r));
    }
    post(req:Request, res:Response): void{
        AlunoService.saveNew(req.body).then((r) => res.json(r));
    }
    update(req: Request, res: Response): void {
        AlunoService.update(req.params['id'], req.body).then((r) => res.json(r));
    }
    
    delete(req: Request, res: Response): void {
        AlunoService.delete(req.params['id']).then((r) => res.json(r));
    }
}

export default new AlunoController();