import tService from '../services/Team.Service';
import mService from '../services/Match.Service';
import { InfoBoard, dbMatch } from '../interfaces/Interfaces';

class LeaderboardHelper {
  private static async calculate(match: dbMatch) {
    const homeGoals = match.homeTeamGoals;
    const awayGoals = match.awayTeamGoals;

    if (homeGoals > awayGoals) return { homeTeam: 3, awayTeam: 0, winner: 'homeTeam' };

    if (homeGoals < awayGoals) return { homeTeam: 0, awayTeam: 3, winner: 'awayTeam' };

    return { homeTeam: 1, awayTeam: 1, winner: 'draw' };
  }

  private static async pointsInfo(id: number | string, type: string) {
    const query = type === 'home' ? 'homeTeam' : 'awayTeam';
    const other = type !== 'home' ? 'homeTeam' : 'awayTeam';
    const matches = await mService.getMatchByTeamId(id, type ? query : undefined);
    const points = await Promise.all(matches.map(this.calculate));
    const totalPoints = points.reduce((acc, match) => acc + match[query], 0);
    const totalGames = points.length;
    const goalsFavor = matches.reduce((acc, match) => acc + match[`${query}Goals`], 0);
    const goalsOwn = matches.reduce((acc, match) => acc + match[`${other}Goals`], 0);
    const efficiency = +((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    return { totalVictories: points.filter((match) => match.winner === query).length,
      totalPoints,
      totalLosses: points.filter((match) => match.winner === other).length,
      totalGames,
      totalDraws: points.filter((match) => match.winner === 'draw').length,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency };
  }

  private static async getMetrics(id: number | string, matches: dbMatch[]) {
    const points = await Promise.all(matches.map(this.calculate));

    const totalPoints = points.reduce((acc, match, index) => {
      const type = matches[index].homeTeam === id ? 'homeTeam' : 'awayTeam';

      return acc + match[type];
    }, 0);

    const totalLosses = points.filter((match, index) => {
      const type = matches[index].homeTeam !== id ? 'homeTeam' : 'awayTeam';

      return match.winner === type;
    }).length;

    const totalDraws = points.filter((match) => match.winner === 'draw').length;
    const totalVictories = points.filter((item, index) => {
      const type = matches[index].homeTeam === id ? 'homeTeam' : 'awayTeam';

      return item.winner === type;
    }).length;

    return { totalDraws, totalLosses, totalPoints, totalVictories };
  }

  private static async getGoals(id: number | string, matches: dbMatch[]) {
    const goalsFavor = matches.reduce((acc, match, index) => {
      const type = matches[index].homeTeam === id ? 'homeTeam' : 'awayTeam';

      return acc + match[`${type}Goals`];
    }, 0);

    const goalsOwn = matches.reduce((acc, match, index) => {
      const type = matches[index].homeTeam !== id ? 'homeTeam' : 'awayTeam';

      return acc + match[`${type}Goals`];
    }, 0);

    const goalsBalance = goalsFavor - goalsOwn;

    return { goalsBalance, goalsFavor, goalsOwn };
  }

  private static async pointsAllTeams(id: number | string) {
    const matches = await mService.getByTeam(id);
    const totalGames = matches.length;

    const points = await this.getMetrics(id, matches);

    const goals = await this.getGoals(id, matches);

    const efficiency = +((points.totalPoints / (totalGames * 3)) * 100).toFixed(2);

    return { totalGames, ...points, ...goals, efficiency };
  }

  static async sortBoard(board: InfoBoard[]) {
    return board.sort((a, b) => b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || b.goalsOwn - a.goalsOwn);
  }

  static async board(type: string) {
    const teams = await tService.getTeams();
    const ids = teams.map((team) => team.id);

    const board: InfoBoard[] = await Promise.all(ids.map(async (id) => {
      const pointsInfo = await this.pointsInfo(id, type);
      const name = await tService.getTeamById(id).then((team) => team.teamName);

      return { ...pointsInfo, name };
    }));

    return board;
  }

  static async fullBoard() {
    const teams = await tService.getTeams();
    const ids = teams.map((team) => team.id);

    const fullBoard = await Promise.all(ids.map(async (id) => {
      const teamInfo = await this.pointsAllTeams(id);
      const name = await tService.getTeamById(id).then((team) => team.teamName);

      return { ...teamInfo, name };
    }));

    return fullBoard;
  }
}

export default LeaderboardHelper;
