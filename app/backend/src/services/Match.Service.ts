import 'dotenv/config';
import mModel from '../database/models/Match.Model';
import tModel from '../database/models/Team.Model';
import { Match } from '../interfaces/Interfaces';

class MatchService {
  static async teamNames(match: Match) {
    const { homeTeam, awayTeam, inProgress } = match;

    const homeTeamName = await tModel.findOne(
      { where: { id: homeTeam }, attributes: ['teamName'] },
    ).then((team) => team?.teamName);

    const awayTeamName = await tModel.findOne(
      { where: { id: awayTeam }, attributes: ['teamName'] },
    ).then((team) => team?.teamName);

    return {
      ...match,
      inProgress: !!inProgress,
      teamHome: { teamName: homeTeamName },
      teamAway: { teamName: awayTeamName },
    };
  }

  static async getMatches(): Promise<Match[]> {
    const matchesList = await mModel.findAll({ raw: true });

    const matches = await Promise.all(
      matchesList.map(MatchService.teamNames),
    );

    return matches as Match[];
  }
}

export default MatchService;
