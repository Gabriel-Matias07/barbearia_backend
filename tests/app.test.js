const request = require('supertest');
const app = require('../server');

let token;
let itemId;

describe('API Barbearia', () => {

  // LOGIN
  it('deve logar e retornar token', async () => {
    const res = await request(app)
      .post('/logar')
      .send({
        email: "admin@barbearia.com",
        senha: "123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  // BLOQUEIO SEM TOKEN
  it('deve bloquear acesso sem token', async () => {
    const res = await request(app)
      .get('/itens');

    expect(res.statusCode).toBe(401);
  });

  // CRIAR ITEM
  it('deve criar um item', async () => {
    const res = await request(app)
      .post('/itens')
      .set('Authorization', token)
      .send({
        nome: "Teste Jest",
        preco: 99
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe("Teste Jest");

    itemId = res.body._id;
  });

  // LISTAR
  it('deve listar itens', async () => {
    const res = await request(app)
      .get('/itens')
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // BUSCAR POR ID
  it('deve buscar item por id', async () => {
    const res = await request(app)
      .get(`/itens/${itemId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(itemId);
  });

  // ATUALIZAR
  it('deve atualizar item', async () => {
    const res = await request(app)
      .put(`/itens/${itemId}`)
      .set('Authorization', token)
      .send({
        nome: "Atualizado Jest",
        preco: 150
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe("Atualizado Jest");
  });

  // DELETAR
  it('deve deletar item', async () => {
    const res = await request(app)
      .delete(`/itens/${itemId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
  });

});

const mongoose = require('mongoose');

afterAll(async () => {
  await mongoose.connection.close();
});