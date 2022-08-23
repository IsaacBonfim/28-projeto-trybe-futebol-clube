import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import { app } from '../app';
import Model from '../database/models/Team.Model';
import { Team } from '../interfaces/Interfaces';
import mock from './mocks/Teams';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando as rotas de Teams', () => {
  let testTeam: Team;

  afterEach(sinon.restore);

  it('Verificando se todos os times retornam corretamente', async () => {
    sinon.stub(Model, 'findAll').resolves(mock as unknown as Model[]);

    const result = await chai.request(app).get('/teams');

    testTeam = result.body[0];

    expect(result).to.have.status(200);
    expect(result.body).to.be.an('array');
  })

  it('Verificando de um erro é retornado ao buscar por um time com uma Id incorreta', async () => {
    sinon.stub(Model, 'findOne').resolves(undefined);

    const result = await chai.request(app).get('/teams/99');

    expect(result).to.have.status(404);
    expect(result.body).to.have.property('message', 'Team not found');
  })

  it('Verificando se um time é retornado corretamente caso a id passada esteja correta', async () => {
    sinon.stub(Model, 'findOne').resolves(mock[0] as unknown as Model);

    const result = await chai.request(app).get('/teams/1');

    expect(result).to.have.status(200);
    expect(result.body).to.be.deep.equal(testTeam);
  })
})
