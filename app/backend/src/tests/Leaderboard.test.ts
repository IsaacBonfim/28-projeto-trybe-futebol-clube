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

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes referentes as rotas de Leaderboard', async () => {
  let login = {
    email: 'user@user.com',
    password: 'secret_user',
  };

  const token = await chai.request(app)
    .post('/login')
    .send(login)
    .then((result) => result.body.token);
  
  describe('Testando a rota GET "/leaderboard"', () => {
    const expected = {
      "totalVictories": 4,
      "totalPoints": 13,
      "totalLosses": 0,
      "totalGames": 5,
      "totalDraws": 1,
      "goalsFavor": 17,
      "goalsOwn": 5,
      "goalsBalance": 12,
      "efficiency": 86.67,
      "name": "Palmeiras"
    };
  
    afterEach(sinon.restore);
  
    it ('Verificando se a lista de classificação é retornada corretamente', async () => {
      const result = await chai.request(app)
        .get('/leaderboard');
        
      expect(result).to.have.status(200);
      expect(result.body).to.be.an('array');
      expect(result.body[0]).to.be.deep.equal(expected);
    })
  })

  describe('Testando a rota GET "/leaderboard/home"', () => {
    const expected = {
      "totalVictories": 3,
      "totalPoints": 9,
      "totalLosses": 0,
      "totalGames": 3,
      "totalDraws": 0,
      "goalsFavor": 9,
      "goalsOwn": 3,
      "goalsBalance": 6,
      "efficiency": 100,
      "name": "Santos"
    };
  
    afterEach(sinon.restore);
  
    it ('Verificando se a lista de classificação por times da casa é retornada corretamente', async () => {
      const result = await chai.request(app)
        .get('/leaderboard/home');
        
      expect(result).to.have.status(200);
      expect(result.body).to.be.an('array');
      expect(result.body[0]).to.be.deep.equal(expected);
    })
  })

  describe('Testando a rota GET "/leaderboard/away"', () => {
    const expected = {
      "totalVictories": 2,
      "totalPoints": 6,
      "totalLosses": 0,
      "totalGames": 2,
      "totalDraws": 0,
      "goalsFavor": 7,
      "goalsOwn": 0,
      "goalsBalance": 7,
      "efficiency": 100,
      "name": "Palmeiras"
    };
  
    afterEach(sinon.restore);
  
    it ('Verificando se a lista de classificação por times de fora é retornada corretamente', async () => {
      const result = await chai.request(app)
        .get('/leaderboard/away');
        
      expect(result).to.have.status(200);
      expect(result.body).to.be.an('array');
      expect(result.body[0]).to.be.deep.equal(expected);
    })
  })
});
