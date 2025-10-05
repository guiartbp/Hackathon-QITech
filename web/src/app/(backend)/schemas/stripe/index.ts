export interface StripeToken {
  access_token: string
  scope: "read_only" | "read_write"
  stripe_user_id: string
}