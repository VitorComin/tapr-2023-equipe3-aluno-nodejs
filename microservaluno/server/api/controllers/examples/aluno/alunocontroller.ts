import { Request, Response } from 'express'

export class AlunoController{
    all(_:Request, res:Response): void{
        res.json([]);
    }
}

export default new AlunoController();