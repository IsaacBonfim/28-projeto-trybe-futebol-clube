class CodeError extends Error {
  code = 500;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

export default CodeError;
