export class MaxDistanceError extends Error {
  constructor() {
    super("Distance exceeds maximum allowed.");
  }
}
