import { Op } from 'sequelize';
import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(require, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: require.body.email }
    });

    if (studentExists) {
      return response.status(400).json({ error: 'Student already exists' });
    }

    const student = await Student.create(require.body);
    return response.json(student);
  }

  async index(require, response) {
    const { search } = require.query;

    const students = await Student.findAll({
      where: {
        name: {
          [Op.like]: search ? `%${search}%` : '% %'
        }
      },
      attributes: ['id', 'name', 'email', 'age']
    });

    if (!students) {
      return response.status(400).json({ error: 'Do not have students yet' });
    }

    return response.json(students);
  }

  async show(require, response) {
    const student = await Student.findByPk(require.params.id);

    if (!student) {
      return response.status(400).json({ error: 'Student do not exist' });
    }

    return response.json(student);
  }

  async update(require, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { email } = require.body;

    const student = await Student.findByPk(require.params.id);

    if (!student) {
      return response.status(400).json({ error: 'Student do not exist' });
    }

    if (email !== student.email) {
      const studentExists = await Student.findOne({
        where: { email }
      });

      if (studentExists) {
        return response.status(400).json({ error: 'User already exists' });
      }
    }

    const updateStudent = await student.update(require.body);

    return response.json(updateStudent);
  }

  async delete(require, response) {
    const student = await Student.findOne({
      where: { id: require.params.id }
    });

    if (!student) {
      return response.status(400).json({ error: 'Student do not exist' });
    }

    await student.destroy();

    return response.status(201).send();
  }
}

export default new StudentController();
