import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import LoginOptionals from "../auth/LoginOptionals";
import RequiredTag from "../input/RequiredTag";

import dynamic from 'next/dynamic';

const CredentialsButton = dynamic(() => import('@/components/auth/CredentialsButton'));
const ValidatedInput = dynamic(() => import('@/components/input/ValidatedInput'));

interface CredentialsLoginFormProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setLoading: (loading: boolean) => void;
  email: string;
  password: string;
  loading: boolean;
  callbackUrl?: string;
  className?: string;
}

function CredentialsLoginForm({ 
  setEmail, 
  setPassword, 
  setLoading,
  email, 
  password,
  loading,
  callbackUrl,
  className
}: CredentialsLoginFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
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
            window.location.href = callbackUrl ?? '/';
          }
        } else {
          // Fallback if session is not available
          window.location.href = callbackUrl ?? '/';
        }
      }
    } catch (error) {
      toast.error('Erro: ' + String(error))
    } finally {
      setLoading(false);
    }
  };
    
  return ( 
    <form className={className ?? ''} onSubmit={handleSubmit}>
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
        containerClassName="mt-4"
        labelClassName="auth-label"
        inputClassName="auth-input"
        iconContainerClassName="auth-icon"
        required
      ><RequiredTag/></ValidatedInput>

      <LoginOptionals />

      <CredentialsButton className="mt-6" disabled={loading}>Entrar</CredentialsButton>
    </form>
   );
}

export default CredentialsLoginForm;