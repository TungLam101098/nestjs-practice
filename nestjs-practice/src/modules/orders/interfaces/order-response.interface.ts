/**
 * Representing the order data returned in API responses
 * This interface defines the structure of order information that will be sent to clients
 */
export interface OrderResponse {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
}
