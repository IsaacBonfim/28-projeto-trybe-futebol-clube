import 'dotenv/config';
import mModel from '../database/models/Match.Model';
import tModel from '../database/models/Team.Model';
import { dbMatch, appMatch, newMatch } from '../interfaces/Interfaces';
import CodeError from '../errors/CodeError';

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

  static async idTeamValidation(id: string) {
    const homeId = await tModel.findOne(
      { where: { id }, attributes: ['id'], raw: true },
    );

    if (!homeId) throw new CodeError('Team not found', 404);
  }

  static async postMatches(match: newMatch) {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = match;

    const createdMatch = await mModel.create({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    }, { raw: true });

    return createdMatch;
  }
}

export default MatchService;
