/**
 * Enum defining standard field names used in authentication flows
 * Provides consistent field identifiers across the application
 */
export enum AuthFields {
  Email = 'email',
}

/**
 * Authentication strategy types used in Passport configuration
 */
export const AuthStrategies = {
  Jwt: 'jwt',
  Local: 'local',
};
