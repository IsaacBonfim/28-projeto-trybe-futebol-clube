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

interface Match {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress?: boolean,
  teamHome?: {
    teamName: string,
  },
  teamAway?: {
    teamName: string,
  }
}

export {
  Login,
  Token,
  Team,
  Match,
};
