import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import { app } from '../app';
import Model from '../database/models/Match.Model';
import mock from './mocks/Matches';
import { dbMatch, appMatch } from '../interfaces/Interfaces';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando as rotas de Matches', () => {
  afterEach(sinon.restore);

  it('Verificando se todas as partidas são retornadas', async () => {
    sinon.stub(Model, 'findAll').resolves(mock as unknown as Model[]);

    const result = await chai.request(app).get('/matches');
    
    expect(result).to.have.status(200);
    expect(result.body).to.be.an('array');
  })
})
