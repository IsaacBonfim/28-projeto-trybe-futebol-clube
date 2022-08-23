import 'dotenv/config';
import Model from '../database/models/Team.Model';
import { Team } from '../interfaces/Interfaces';

class TeamService {
  static async getTeams(): Promise<Team[]> {
    const teams = await Model.findAll(
      { attributes: { include: ['id'] } },
    );

    return teams;
  }
}

export default TeamService;
