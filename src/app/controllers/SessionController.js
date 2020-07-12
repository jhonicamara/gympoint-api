import jwt from 'jsonwebtoken';

import * as Yup from 'yup';

// É necessário adicionar o model do usúario
import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(require, response) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = require.body;

    // Aqui nos fazemos uma verificacao se existe um usuário com o
    // email respassado no corpo da requisicao
    const user = await User.findOne({
      where: { email }
    });

    // Se não tiver retornamos o erro 401 (Unauthorized)
    if (!user) {
      return response.status(401).json({ error: 'User not found' });
    }

    // Se a senha informada estiver errada, retornamos o mesmo erro
    if (!(await user.checkPassword(password))) {
      return response.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    // Caso o usuário exista, nos retornamos o id, o name e o email
    return response.json({
      user: {
        id,
        name,
        email
      },

      // E também retornamos o token jwt criado
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
