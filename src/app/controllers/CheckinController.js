import { Op } from 'sequelize';
import { subDays, startOfDay, endOfDay, parse } from 'date-fns';

import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';

class CheckinController {
  async store(require, response) {
    const { studentId } = require.params;

    const userExists = await Student.findByPk(studentId);

    if (!userExists) {
      return response.status(400).json({ error: 'Student do not exists' });
    }

    const enrollExists = await Enrollment.findOne({
      where: {
        student_id: studentId
      },
      attributes: ['id', 'active']
    });

    if (!enrollExists || enrollExists.active === false) {
      return response
        .status(400)
        .json({ error: 'Student do not have enrollment' });
    }

    const endDate = new Date();
    const startDate = subDays(endDate, 7);

    const repeatCheckins = await Checkin.findAndCountAll({
      where: {
        student_id: studentId,
        created_at: { [Op.between]: [startOfDay(endDate), endOfDay(endDate)] }
      }
    });

    if (repeatCheckins.count >= 1) {
      return response
        .status(404)
        .json({ error: 'Checkins for a day reached the limit' });
    }

    const checkins = await Checkin.findAndCountAll({
      where: {
        student_id: studentId,
        created_at: {
          [Op.between]: [startOfDay(startDate), endOfDay(endDate)]
        }
      }
    });

    if (checkins.count >= 5) {
      return response.status(404).json({ error: 'Checkins limit reached' });
    }

    const checkin = await Checkin.create({
      student_id: studentId
    });

    return response.json(checkin);
  }

  async show(require, response) {
    const { studentId } = require.params;

    const checkins = await Checkin.findAll({
      where: { student_id: studentId }
    });

    if (!checkins || checkins.toString() === '') {
      return response
        .status(404)
        .json({ error: 'Student do not have checkins yet' });
    }

    return response.json(checkins);
  }
}

export default new CheckinController();
