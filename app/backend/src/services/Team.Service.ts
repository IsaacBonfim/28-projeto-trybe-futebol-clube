import 'dotenv/config';
import Model from '../database/models/Team.Model';
import { Team } from '../interfaces/Interfaces';
import CodeError from '../errors/CodeError';

class TeamService {
  static async getTeams(): Promise<Team[]> {
    const teams = await Model.findAll(
      { attributes: { include: ['id'] } },
    );

    return teams;
  }

  static async getTeamById(id: string | number): Promise<Team> {
    const team = await Model.findOne(
      { where: { id }, raw: true },
    );

    if (!team) {
      throw new CodeError('Team not found', 404);
    }

    return team as Team;
  }
}

export default TeamService;
