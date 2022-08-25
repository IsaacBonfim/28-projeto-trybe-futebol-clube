import 'dotenv/config';
import mModel from '../database/models/Match.Model';
import tModel from '../database/models/Team.Model';
import { dbMatch, appMatch } from '../interfaces/Interfaces';

class MatchService {
  static async teamNames(match: dbMatch) {
    const { homeTeam, awayTeam, inProgress } = match;

    const homeTeamName = await tModel.findOne(
      { where: { id: homeTeam }, attributes: ['teamName'], raw: true },
    ).then((team) => team?.teamName);

    const awayTeamName = await tModel.findOne(
      { where: { id: awayTeam }, attributes: ['teamName'], raw: true },
    ).then((team) => team?.teamName);

    return {
      ...match,
      inProgress: !!inProgress,
      teamHome: { teamName: homeTeamName },
      teamAway: { teamName: awayTeamName },
    };
  }

  static async getMatches(): Promise<appMatch[]> {
    const matchList = await mModel.findAll({ raw: true });

    const matches = await Promise.all(
      matchList.map(MatchService.teamNames),
    );

    return matches as appMatch[];
  }
}

export default MatchService;
