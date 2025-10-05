export async function exchangeCodeForToken(code: string) {
  const data = new URLSearchParams()
  data.append("client_secret", process.env.STRIPE_SECRET_KEY!)
  data.append("code", code)
  data.append("grant_type", "authorization_code")

  const res = await fetch("https://connect.stripe.com/oauth/token", { method: "POST", body: data })
  return res.json()
}