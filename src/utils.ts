import { Request, Response, NextFunction } from 'express'

export const asyncWrap = (fn : (req: Request, res: Response) => Promise<any>) =>
  (req: Request, res: Response, done: NextFunction) => fn(req, res).catch(done)
