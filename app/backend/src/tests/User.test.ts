import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import { app } from '../app';
import User from '../database/models/User.Model';
import mock from './mocks/Users';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando as rotas de Login', () => {
  let login = {
    email: 'admin@admin.com',
    password: 'secret_admin',
  };

  beforeEach(() => {
    login = {
      email: 'admin@admin.com',
      password: 'secret_admin',
    };
  })

  afterEach(sinon.restore);

  it('Verificando se um erro é retornado caso o email não seja informado', async () => {
    sinon.stub(User, 'findOne').resolves();

    login.email = '';

    const result = await chai.request(app).post('/login').send(login);

    expect(result).to.have.status(400);
    expect(result.body).to.have.property('message', 'All fields must be filled');
  })

  it('Verificando se um erro é retornado caso o email esteja incorreto', async () => {
    sinon.stub(User, 'findOne').resolves();

    login.email = 'xa@blau.com';

    const result = await chai.request(app).post('/login').send(login);

    expect(result).to.have.status(401);
    expect(result.body).to.have.property('message', 'Incorrect email or password');
  })

  it('Verificando se um erro é retornado caso o email seja invalido', async () => {
    sinon.stub(User, 'findOne').resolves();

    login.email = 'xablau.com';

    const result = await chai.request(app).post('/login').send(login);

    expect(result).to.have.status(401);
    expect(result.body).to.have.property('message', 'Incorrect email or password');
  })

  it('Verificando se um erro é retornado caso a senha não seja informada', async () => {
    sinon.stub(User, 'findOne').resolves();

    login.password = '';

    const result = await chai.request(app).post('/login').send(login);

    expect(result).to.have.status(400);
    expect(result.body).to.have.property('message', 'All fields must be filled');
  })

  it('Verificando se um erro é retornado caso a senha esteja incorreta', async () => {
    sinon.stub(User, 'findOne').resolves(mock[0] as User);

    login.password = 'senhaerrada';

    const result = await chai.request(app).post('/login').send(login);

    expect(result).to.have.status(401);
    expect(result.body).to.have.property('message', 'Incorrect email or password');
  })

  it('Verificando se um token é retornado caso as informações estejam corretas', async () => {
    sinon.stub(User, 'findOne').resolves(mock[0] as User);

    const result = await chai.request(app).post('/login').send(login);

    expect(result.body).to.have.property('token');
  })

  it('Verificando se a categoria do usuário(role) é retornado', async () => {
    sinon.stub(User, 'findOne').resolves(mock[0] as User);

    const token = await chai.request(app)
      .post('/login')
      .send(login)
      .then((response) => response.body.token);

    const result = await chai.request(app)
      .get('/login/validate')
      .set('Authorization', token);

    expect(result.body).to.have.property('role');
  })

  it('Verificando se um erro é retornado caso o token seja invalido', async () => {
    const result = await chai.request(app)
      .get('/login/validate');

    expect(result.status).to.equal(500);
  })
})
