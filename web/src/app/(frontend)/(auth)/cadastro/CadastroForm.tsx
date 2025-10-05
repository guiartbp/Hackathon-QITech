'use client'
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import LoginOptionals from "@/components/auth/LoginOptionals";

import RequiredTag from "@/components/input/RequiredTag";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

import dynamic from 'next/dynamic';

const GoogleAuthButton = dynamic(() => import('@/components/auth/GoogleLoginButton'));
const CredentialsButton = dynamic(() => import('@/components/auth/CredentialsButton'));
const ValidatedInput = dynamic(() => import('@/components/input/ValidatedInput'));

type UserType = 'investor' | 'founder';

interface CadastroFormProps {
  isDarkBackground?: boolean;
  onUserTypeChange?: (userType: UserType) => void;
}

function CadastroForm({ isDarkBackground = true, onUserTypeChange }: CadastroFormProps = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('investor');

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleUserTypeChange = (newUserType: UserType) => {
    setUserType(newUserType);
    onUserTypeChange?.(newUserType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        userType, // Pass userType directly as an additional field
        callbackURL: "/in/contratodetalhes",
      });

      if (result.error) {
        toast.error((result.error?.message || 'Erro desconhecido'));
        setLoading(false);
      } else {
        // Success! User created, now redirect based on userType
        toast.success('Cadastro realizado com sucesso!');

        // Manual redirect to appropriate onboarding flow
        const redirectPath = userType === 'investor'
          ? '/cadastro/in/nome'
          : '/cadastro/to/dados-pessoais';

        router.push(redirectPath);
      }
    } catch (error) {
      toast.error('Erro: ' + String(error));
      setLoading(false);
    }
  };

  return ( 
    <div className="lg:w-[90%] xl:w-[80%]">
      {/* User Type Toggle */}
      <div className="mb-8">
        <div className="flex bg-gray-800 rounded-full p-1 w-fit mx-auto">
          <button
            type="button"
            onClick={() => handleUserTypeChange('investor')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              userType === 'investor'
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Investidor
          </button>
          <button
            type="button"
            onClick={() => handleUserTypeChange('founder')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              userType === 'founder'
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Founder
          </button>
        </div>
      </div>

      <h2 className={`font-bold text-[40px] text-center leading-12 ${isDarkBackground ? 'text-white' : 'text-black'}`}>Cadastro</h2>
      <form className="mt-6" onSubmit={handleSubmit}>
        <ValidatedInput 
          title="Nome"
          placeholder="Pedro Salles"
          name="name"
          type="name"
          value={name}
          setValue={setName}
          labelClassName={isDarkBackground ? 'auth-label' : 'auth-label-light'}
          inputClassName={isDarkBackground ? 'auth-input' : 'auth-input-light'}
          iconContainerClassName="auth-icon"
          required
        ><RequiredTag/></ValidatedInput>
        <ValidatedInput 
          title="E-mail"
          placeholder="exemplo@email.com.br"
          name="email"
          type="email"
          value={email}
          setValue={setEmail}
          labelClassName={isDarkBackground ? 'auth-label' : 'auth-label-light'}
          inputClassName={isDarkBackground ? 'auth-input' : 'auth-input-light'}
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

          overrideValidate={(val: string) => val.length >= 6}

          containerClassName="mt-4"
          labelClassName={isDarkBackground ? 'auth-label' : 'auth-label-light'}
          inputClassName={isDarkBackground ? 'auth-input' : 'auth-input-light'}
          iconContainerClassName="auth-icon"
          required
        ><RequiredTag/></ValidatedInput>        <LoginOptionals />

        <CredentialsButton className="mt-6" disabled={loading}>Cadastrar</CredentialsButton>
      </form>
      
      <div className="flex items-center gap-4 py-5">
        <div className={`flex-grow h-0.5 ${isDarkBackground ? 'bg-gray-600' : 'bg-gray-300'}`} />
        <p className={`text-lg ${isDarkBackground ? 'text-gray-400' : 'text-gray-600'}`}>ou</p>
        <div className={`flex-grow h-0.5 ${isDarkBackground ? 'bg-gray-600' : 'bg-gray-300'}`} />
      </div>

      <GoogleAuthButton disabled={loading} text="Entrar com Google" />

      <Link href='/login' className={`block w-fit mt-8 text-sm group ${isDarkBackground ? 'text-gray-400' : 'text-gray-600'}`}>
        Já tem uma conta? 
        <span className={`colorTransition border-b border-transparent group-hover:border-orange-500 ${
          isDarkBackground ? 'text-orange-500' : 'text-black'
        } ${
          isDarkBackground ? '' : 'group-hover:border-black'
        }`}>
          Faça login
        </span>
      </Link>
    </div>
   );
}

export default CadastroForm;