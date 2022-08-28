import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import { app } from '../app';
import mModel from '../database/models/Match.Model';
import tModel from '../database/models/Team.Model';
import mMock from './mocks/Matches';
import tMock from './mocks/Teams';
import { appMatch } from '../interfaces/Interfaces';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando as rotas de Matches', () => {
  afterEach(sinon.restore);

  let token = '';

  it('Verificando se todas as partidas são retornadas', async () => {
    sinon.stub(mModel, 'findAll').resolves(mMock as unknown as mModel[]);

    const result = await chai.request(app).get('/matches');
    
    expect(result).to.have.status(200);
    expect(result.body).to.be.an('array');
  })

  it('Verificando se é retornado apenas as partidas em andamento caso a query seja "true"', async () => {
    sinon.stub(mModel, 'findAll').resolves(mMock.filter((match) => match.inProgress) as mModel[]);

    const result = await chai.request(app)
      .get('/matches?inProgress=true');

    expect(result).to.have.status(200);
    result.body.forEach((match: appMatch) => {
      const { inProgress } = match;
      expect(inProgress).to.be.true;
    })
  })

  it('Verificando se é retornado apenas as partidas em andamento caso a query seja "false"', async () => {
    sinon.stub(mModel, 'findAll').resolves(mMock.filter((match) => !match.inProgress) as mModel[]);

    const result = await chai.request(app)
      .get('/matches?inProgress=false');

    expect(result).to.have.status(200);
    result.body.forEach((match: appMatch) => {
      const { inProgress } = match;
      expect(inProgress).to.be.false;
    })
  })

  it ('Verificando se não é possível criar uma partida sem um token', async () => {
    const result = await chai.request(app)
      .post('/matches')
      .send({
        "homeTeam": 16,
        "awayTeam": 8,
        "homeTeamGoals": 2,
        "awayTeamGoals": 2
      })
    
      expect(result).to.have.status(401);
      expect(result.body).to.have.property('message', 'Token must be a valid token');
  })

  it ('Verificando se não é possível criar uma partida com um token inválido', async () => {
    token = 'inválido';

    const result = await chai.request(app)
      .post('/matches')
      .set('Authorization', token)
      .send({
        "homeTeam": 16,
        "awayTeam": 8,
        "homeTeamGoals": 2,
        "awayTeamGoals": 2
      })
    
      expect(result).to.have.status(401);
      expect(result.body).to.have.property('message', 'Token must be a valid token');
  })

  it ('Verificando se não é possível criar uma partida caso os times informados sejam iguais', async () => {
    token = await chai.request(app)
      .post('/login')
      .send({
        email: 'user@user.com',
        password: 'secret_user',
      })
      .then((login) => login.body.token);
    
    const result = await chai.request(app)
      .post('/matches')
      .set('Authorization', token)
      .send({
        "homeTeam": 16,
        "awayTeam": 16,
        "homeTeamGoals": 2,
        "awayTeamGoals": 2
      })
    
    expect(result).to.have.status(401);
    expect(result.body).to.have.property('message', 'It is not possible to create a match with two equal teams');
  })

  it ('Virificando se não é possível criar uma partida caso um dos times informados não exista', async () => {
    sinon.stub(tModel, 'findOne')
      .withArgs({ where: { id: 99 } }).resolves(undefined)
      .withArgs({ where: { id: 8 } })
      .resolves(tMock.find((team) => team.id === 8) as unknown as tModel);

    const result = await chai.request(app)
      .post('/matches')
      .set('Authorization', token)
      .send({
        "homeTeam": 99,
        "awayTeam": 8,
        "homeTeamGoals": 2,
        "awayTeamGoals": 2
      });
    
    expect(result).to.have.status(404);
    expect(result.body).to.have.property('message', 'There is no team with such id!');
  })

  it ('Virificando se é possível criar uma partida', async () => {    
    sinon.stub(mModel, 'create').resolves({
      id: mMock.length,
      homeTeam: 16,
      awayTeam: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
      inProgress: true,
    } as mModel)

    const result = await chai.request(app)
      .post('/matches')
      .set('Authorization', token)
      .send({
        "homeTeam": 16,
        "awayTeam": 8,
        "homeTeamGoals": 2,
        "awayTeamGoals": 2
      })
    
    const expected = {
      "id": 48,
      "homeTeam": 16,
      "homeTeamGoals": 2,
      "awayTeam": 8,
      "awayTeamGoals": 2,
      "inProgress": true,
    }

    expect(result).to.have.status(201);
    expect(result.body).to.be.deep.equal(expected);
  })

  it ('Verificando se é possível atualizar uma partida em andamento', async () => {
    sinon.stub(mModel, 'findAll').resolves(mMock.filter((match) => match.inProgress) as mModel[]);
    sinon.stub(mModel, 'update').resolves();

    const result = await chai.request(app).get('/matches?inProgress=true');

    const id = result.body[0].id;

    const updatedResult = await chai.request(app).patch(`/matches/${id}/finish`);

    expect(updatedResult).to.have.status(200);
    expect(updatedResult.body).to.have.property('message', 'Finished');
  })

  it ('Verificando se é posssível atualizar o placar de uma partida em andamento', async () => {
    sinon.stub(mModel, 'findAll').resolves(mMock.filter((match) => match.inProgress) as mModel[]);
    sinon.stub(mModel, 'update').resolves();
    
    const result = await chai.request(app)
      .get('/matches?inProgress=true')
    
    const id = result.body[0].id;
    
    const updatedResult = await chai.request(app)
      .patch(`/matches/${id}`)
      .send({
        "homeTeamGoals": 3,
        "awayTeamGoals": 1,
      });
    
    expect(updatedResult).to.have.status(200);
  })
})
