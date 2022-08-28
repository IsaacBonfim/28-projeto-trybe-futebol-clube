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

  static async getMatchByTeamId(id: string | number, type = '') {
    let matches: dbMatch[];

    if (type) {
      matches = await mModel.findAll({
        where: { [type]: id, inProgress: false }, raw: true,
      });
    } else {
      matches = await mModel.findAll({
        where: { inProgress: false }, raw: true,
      });
    }

    return matches;
  }

  static async idTeamValidation(id: string | number) {
    const homeId = await tModel.findOne(
      { where: { id }, attributes: ['id'], raw: true },
    );

    if (!homeId) throw new CodeError('There is no team with such id!', 404);
  }

  static async postMatches(match: newMatch) {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = match;

    if (homeTeam === awayTeam) {
      throw new CodeError('It is not possible to create a match with two equal teams', 401);
    }

    const createdMatch = await mModel.create({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    }, { raw: true });

    return createdMatch;
  }

  static async finishMatch(id: string | number) {
    const match = await mModel.update({ inProgress: false }, { where: { id } });

    return match;
  }

  static async updateMatch(
    id: string | number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ) {
    const matchUpdated = await mModel.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });

    return matchUpdated;
  }
}

export default MatchService;
