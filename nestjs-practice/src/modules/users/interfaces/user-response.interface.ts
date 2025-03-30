/**
 * Representing the user data returned in API responses
 * This interface defines the structure of user information that will be sent to clients
 */
export interface UserResponse {
  id: string;
  role: string;
  email: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}
