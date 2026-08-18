export interface QRCodeData {
  paymentId: string;
  amount: number;
  expiresAt: Date;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
} 