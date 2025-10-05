'use client'
import Link from "next/link";
import { useState, useEffect } from "react";

import LoginOptionals from "@/components/auth/LoginOptionals";

import RequiredTag from "@/components/input/RequiredTag";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

import dynamic from 'next/dynamic';

const GoogleAuthButton = dynamic(() => import('@/components/auth/GoogleLoginButton'));
const CredentialsButton = dynamic(() => import('@/components/auth/CredentialsButton'));
const ValidatedInput = dynamic(() => import('@/components/input/ValidatedInput'));

function LoginForm() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        // Don't use callbackURL here, we'll handle redirect manually
      });

      if (result.error) {
        toast.error((result.error?.message || 'Erro desconhecido'))
      } else {
        // Success! User logged in
        toast.success('Login realizado com sucesso!');
        
        // Get user session to check userType
        const session = await authClient.getSession();
        
        if (session?.data?.user) {
          const userType = (session.data.user as any).userType;
          
          // Redirect based on user type
          if (userType === 'investor') {
            window.location.href = '/in/portfolio/evolucao';
          } else if (userType === 'founder') {
            window.location.href = '/to/minhas_dividas';
          } else {
            // Default redirect if userType is not set
            window.location.href = '/';
          }
        } else {
          // Fallback if session is not available
          window.location.href = '/';
        }
      }
    } catch (error) {
      toast.error('Erro: ' + String(error))
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <div className="lg:w-[90%] xl:w-[80%]">
      <h1 className="font-bold text-[64px] text-white leading-16">Bem vindo de volta!</h1>

      <form className="mt-6" onSubmit={handleSubmit}>
        <ValidatedInput 
          title="E-mail"
          placeholder="exemplo@email.com.br"
          name="email"
          type="email"
          value={email}
          setValue={setEmail}
          labelClassName='auth-label'
          inputClassName='auth-input'
          iconContainerClassName="auth-icon"
          required
        ><RequiredTag/></ValidatedInput>
        
        <ValidatedInput 
          title="Senha"
          placeholder="Insira sua senha"
          name="password"
          type="password"
          value={password}
          setValue={setPassword}

          overrideValidate={(val) => val.length >= 6}

          containerClassName="mt-4"
          labelClassName="auth-label"
          inputClassName="auth-input"
          iconContainerClassName="auth-icon"
          required
        ><RequiredTag/></ValidatedInput>

        <LoginOptionals />

        <CredentialsButton className="mt-6" disabled={loading}>Entrar</CredentialsButton>
      </form>
      
      <div className="flex items-center gap-4 py-5">
        <div className="flex-grow h-0.5 bg-gray-400" />
        <p className="text-gray-400 text-lg">ou</p>
        <div className="flex-grow h-0.5 bg-gray-400" />
      </div>

      <GoogleAuthButton disabled={loading} text="Entrar com Google" />

      <Link href='/cadastro' className="block w-fit mt-8 text-sm group">Ainda não tem uma conta? <span className="text-orange-500 colorTransition border-b border-transparent group-hover:border-pink-500">Cadastre-se</span></Link>
    </div>
   );
}

export default LoginForm;

