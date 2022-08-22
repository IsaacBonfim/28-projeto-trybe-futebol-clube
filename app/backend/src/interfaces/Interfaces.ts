interface Login {
  email: string,
  password: string,
}

interface Token {
  data: {
    email: string,
  }
}

export {
  Login,
  Token,
};
