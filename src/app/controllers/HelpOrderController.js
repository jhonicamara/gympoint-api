import * as Yup from 'yup';

import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(require, response) {
    const help_orders = await HelpOrder.findAll({
      attributes: ['id', 'student_id', 'question'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name']
        }
      ]
    });

    return response.json(help_orders);
  }

  async store(require, response) {
    const schema = Yup.object().shape({
      question: Yup.string().required()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { studentId } = require.params;
    const { question } = require.body;

    const studentExists = await Student.findByPk(studentId);

    if (!studentExists) {
      return response.status(400).json({ error: 'Student do not exists' });
    }

    const help_order = await HelpOrder.create({
      student_id: studentId,
      question
    });

    return response.json(help_order);
  }

  async show(require, response) {
    const { studentId } = require.params;

    const studentExists = await Student.findByPk(studentId);

    if (!studentExists) {
      return response.status(400).json({ error: 'Student do not exists' });
    }

    const help_orders = await HelpOrder.findAll({
      where: { student_id: studentId }
    });

    if (!help_orders) {
      return response
        .status(400)
        .json({ error: 'Student do not request a help order' });
    }

    return response.json(help_orders);
  }

  async update(require, response) {
    const schema = Yup.object().shape({
      answer: Yup.string().required()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { helpOrderId } = require.params;
    const { answer } = require.body;

    const helpOrder = await HelpOrder.findByPk(helpOrderId);

    if (!helpOrder) {
      return response.status(400).json({ error: 'Help Order do not exists' });
    }

    const updateHelpOrder = await helpOrder.update({
      answer,
      answer_at: new Date()
    });

    return response.json(updateHelpOrder);
  }
}

export default new HelpOrderController();
