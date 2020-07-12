import Student from '../models/Student';

class SessionStudentController {
  async show(require, response) {
    const student = await Student.findByPk(require.body.id);

    if (!student) {
      return response.status(400).json({ error: 'Student do not exist' });
    }

    return response.json(student);
  }
}

export default new SessionStudentController();
