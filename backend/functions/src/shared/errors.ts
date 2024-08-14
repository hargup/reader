export class SecurityCompromiseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityCompromiseError';
  }
}

export class ServiceCrashedError extends Error {
  constructor({ message }: { message: string }) {
    super(message);
    this.name = 'ServiceCrashedError';
  }
}
