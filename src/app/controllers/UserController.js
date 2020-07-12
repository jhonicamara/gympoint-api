import User from '../models/User';

class UserController {
  // Este método store é responsável pela criação de um usuário
  async store(require, response) {
    const userExists = await User.findOne({
      where: { email: require.body.email }
    });

    if (userExists) {
      return response.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create(require.body);
    return response.json(user);
  }
}

export default new UserController();
