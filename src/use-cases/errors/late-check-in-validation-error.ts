export class LateCheckInValidationError extends Error {
  constructor() {
    super("Check-in validation time has expired.");
  }
}
