import * as Yup from 'yup';
import { addMonths, isBefore } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

class EnrollmentController {
  async store(require, response) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = require.body;

    const studentExists = await Student.findOne({
      where: { id: student_id }
    });

    if (!studentExists) {
      return response.status(400).json({ error: 'Student do not exists' });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id }
    });

    if (!plan) {
      return response.status(400).json({ error: 'Plan do not exists' });
    }

    const { duration, price } = plan;

    const verifyDate = isBefore(new Date(start_date), new Date());

    if (verifyDate) {
      return response
        .status(400)
        .json({ error: 'You can not start a enroll in the past ' });
    }

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date: new Date(start_date),
      end_date: addMonths(new Date(start_date), duration),
      price: duration * price
    });

    return response.json(enrollment);
  }

  async index(require, response) {
    const enrollments = await Enrollment.findAll({
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'start_date',
        'end_date',
        'active'
      ],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name']
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title']
        }
      ]
    });

    if (!enrollments) {
      return response
        .status(400)
        .json({ error: 'Do not have enrollments yet' });
    }

    return response.json(enrollments);
  }

  async show(require, response) {
    const enrollment = await Enrollment.findOne({
      where: { id: require.params.id },
      attributes: ['id', 'student_id', 'plan_id', 'start_date', 'end_date'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name']
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration']
        }
      ]
    });

    if (!enrollment) {
      return response.status(400).json({ error: 'Enroll do not exists' });
    }

    return response.json(enrollment);
  }

  async update(require, response) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const enrollment = await Enrollment.findByPk(require.params.id);

    if (!enrollment) {
      return response.status(400).json({ error: 'Enroll do not exists' });
    }

    const { student_id, plan_id, start_date } = require.body;

    const userExists = await Student.findOne({
      where: { id: student_id }
    });

    if (!userExists) {
      return response.status(400).json({ error: 'Student do not exists' });
    }

    const planExists = await Plan.findOne({
      where: { id: plan_id }
    });

    if (!planExists) {
      return response.status(400).json({ error: 'Plan  do not exists' });
    }

    const { duration, price } = planExists;

    const verifyDate = isBefore(new Date(start_date), new Date());

    if (verifyDate) {
      return response
        .status(400)
        .json({ error: 'You can not update a enroll to a past date' });
    }

    await enrollment.update({
      student_id,
      plan_id,
      start_date: new Date(start_date),
      end_date: addMonths(new Date(start_date), duration),
      price: duration * price
    });

    return response.json(enrollment);
  }

  async delete(require, response) {
    const enrollment = await Enrollment.findByPk(require.params.id);

    if (!enrollment) {
      return response.status(400).json({ error: 'Enroll do not exists' });
    }

    await enrollment.destroy();

    return response.status(201).send();
  }
}

export default new EnrollmentController();
