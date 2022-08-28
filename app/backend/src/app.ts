import * as express from 'express';
import * as cors from 'cors';
import 'express-async-errors';
import lRoute from './routes/User.Routes';
import tRoute from './routes/Team.Routes';
import mRoute from './routes/Match.Routes';
import bRoute from './routes/Leaderboard.Routes';
import Errors from './middleware/Error.Middleware';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    //! Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
    this.app.use(cors());

    this.app.use('/leaderboard', bRoute);
    this.app.use('/login', lRoute);
    this.app.use('/matches', mRoute);
    this.app.use('/teams', tRoute);

    this.app.use(Errors);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
