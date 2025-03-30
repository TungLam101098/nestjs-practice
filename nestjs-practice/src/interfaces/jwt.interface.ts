/**
 * Interface representing the decoded JWT payload
 * Contains essential user information stored in the token
 */
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
