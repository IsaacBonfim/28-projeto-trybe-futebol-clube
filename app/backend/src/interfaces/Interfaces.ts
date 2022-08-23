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

export {
  Login,
  Token,
  Team,
};
