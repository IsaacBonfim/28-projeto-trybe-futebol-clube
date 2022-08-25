interface Login {
  email: string,
  password: string,
}

interface Token {
  data: {
    email: string,
  }
}

interface Team {
  id: number,
  teamName: string,
}

interface dbMatch {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress?: boolean,
}

interface appMatch extends dbMatch {
  teamHome?: {
    teamName: string,
  },
  teamAway?: {
    teamName: string,
  }
}

interface newMatch {
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
}

export {
  Login,
  Token,
  Team,
  dbMatch,
  appMatch,
  newMatch,
};
