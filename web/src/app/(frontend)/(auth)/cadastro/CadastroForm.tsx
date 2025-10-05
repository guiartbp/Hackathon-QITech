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

interface CadastroFormProps {
  isDarkBackground?: boolean;
}

function CadastroForm({ isDarkBackground = true }: CadastroFormProps = {}) {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'investor' | 'founder' | ''>(''); // nova role

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error("Selecione seu perfil: Investidor ou Founder.");
      return;
    }
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
        attributes: {
          role, // manda a role escolhida
        },
      });

      if (result.error) {
        toast.error(result.error?.message || 'Erro desconhecido');
      }
    } catch (error) {
      toast.error('Erro: ' + String(error));
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <div className="lg:w-[90%] xl:w-[80%]">
      <h2 className={`font-bold text-[40px] text-center leading-12 ${isDarkBackground ? 'text-white' : 'text-black'}`}>
        Cadastro
      </h2>

      <form className="mt-6" onSubmit={handleSubmit}>
        <ValidatedInput 
          title="Nome"
          placeholder="Pedro Salles"
          name="name"
          type="text"
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
        ><RequiredTag/></ValidatedInput>        

        {/* Botões Investidor | Founder */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => setRole('investor')}
            className={`px-4 py-2 rounded-lg border font-medium transition ${
              role === 'investor' 
                ? 'bg-orange-500 text-white border-orange-500' 
                : 'bg-transparent border-gray-400 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Investidor
          </button>

          <button
            type="button"
            onClick={() => setRole('founder')}
            className={`px-4 py-2 rounded-lg border font-medium transition ${
              role === 'founder' 
                ? 'bg-orange-500 text-white border-orange-500' 
                : 'bg-transparent border-gray-400 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Founder
          </button>
        </div>

        <LoginOptionals />

        <CredentialsButton className="mt-6" disabled={loading}>
          Cadastrar
        </CredentialsButton>
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
