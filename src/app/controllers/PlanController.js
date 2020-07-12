import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async store(require, response) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const planExists = await Plan.findOne({
      where: { title: require.body.title }
    });

    if (planExists) {
      return response.status(400).json({ error: 'Plan already exists' });
    }

    const plan = await Plan.create(require.body);
    return response.json(plan);
  }

  async index(require, response) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price']
    });

    if (!plans) {
      return response.status(400).json({ error: 'Do not have plans yet' });
    }

    return response.json(plans);
  }

  async show(require, response) {
    const plan = await Plan.findOne({
      where: { id: require.params.id },
      attributes: ['id', 'title', 'duration', 'price']
    });

    if (!plan) {
      return response.status(400).json({ error: 'Plan do not exist' });
    }

    return response.json(plan);
  }

  async update(require, response) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { title } = require.body;

    const plan = await Plan.findByPk(require.params.id);

    if (title !== plan.title) {
      const planExists = await Plan.findOne({
        where: { title }
      });

      if (planExists) {
        return response.status(400).json({ error: 'Plan already exists' });
      }
    }

    const updatePlan = await plan.update(require.body);

    return response.json(updatePlan);
  }

  async delete(require, response) {
    const plan = await Plan.findOne({
      where: { id: require.params.id }
    });

    if (!plan) {
      return response.status(400).json({ error: 'Plan do not exists' });
    }

    await plan.destroy();

    return response.status(201).send();
  }
}

export default new PlanController();
