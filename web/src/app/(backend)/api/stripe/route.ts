import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }

  // Aqui você pode verificar se o state bate com o que você gerou (CSRF protection)

  // Trocar o code por access_token
  const data = new URLSearchParams()
  data.append("client_secret", process.env.STRIPE_SECRET_KEY!)
  data.append("code", code)
  data.append("grant_type", "authorization_code")

  const res = await fetch("https://connect.stripe.com/oauth/token", {
    method: "POST",
    body: data
  })

  const json = await res.json()

  // json.access_token agora tem o token read-only
  // você pode salvar no banco, ou associar ao usuário logado
  return NextResponse.json(json)
}
