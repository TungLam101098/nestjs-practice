/**
 * Representing the food data returned in API responses
 * This interface defines the structure of food information that will be sent to clients
 */
export interface FoodResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
