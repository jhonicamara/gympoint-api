import jwt from 'jsonwebtoken';

import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (require, response, next) => {
  // Aqui nos pegamos o token nos headers no campo authorization
  const authHeader = require.headers.authorization;

  // Se não tiver o token retornamos o erro 401 (Unauthorized)
  if (!authHeader) {
    return response.status(401).json({ error: 'Token not provided' });
  }

  // O token que nos recebemos ele vem com a seguinte estrutura:
  // 'Bearer [token]'

  // Aqui é separado o Bearer e o token a partir do espaco entre eles
  // Neste caso nos separamos em duas variaveis o texto
  // A , e o 'Bearer' e o token é o '[token]'
  const [, token] = authHeader.split(' ');

  try {
    // Aqui nos utilizamos a dependencia fazendo com que ela torne a
    // funcao verify que funciona com o async e o await

    // Nos passamos o token informado com o usuário é comparamos com
    // o payload que determinamos no authConfig
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Caso seja igual, nos adicionamos o id do usuario a uma variavel
    // que podera ser acessada no nosso middleware
    require.userId = decoded.id;

    // Com o método next nos continuámos o fluxo da nossa aplicacao
    return next();
  } catch (error) {
    // Caso algo de errado na verificacao nos retornamos
    // o erro 401 (Unauthorized)
    return response.status(401).json({ erro: 'Token invalid' });
  }
};
