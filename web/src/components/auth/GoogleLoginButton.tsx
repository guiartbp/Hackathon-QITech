'use client'
import clsx from "clsx";
import Image from "next/image";

import { authClient } from "@/lib/auth-client";
import { ButtonHTMLAttributes } from "react";

interface GoogleAuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text?: string;
};

function GoogleAuthButton({ className, text, ...props }: GoogleAuthButtonProps) {
  
  return ( 
      <div
        className={clsx("w-full flex-1", className)}
      >
        <input type="hidden" name="type" value="google" />

        <button type="submit" className='login-button tracking-4' {...props}
        onClick={async () => {
          if (props.disabled) {
            return
          } 
          
          // Sign in with Google
          await authClient.signIn.social({
            provider: "google",
            // Will handle redirect after successful authentication
          });
          
          // After successful Google login, check user type and redirect
          try {
            const session = await authClient.getSession();
            
            if (session?.data?.user) {
              const userType = (session.data.user as any).userType;
              
              // Redirect based on user type
              if (userType === 'investor') {
                window.location.href = '/in/portfolio/evolucao';
              } else if (userType === 'founder') {
                window.location.href = '/to/minhas_dividas';
              } else {
                window.location.href = '/';
              }
            }
          } catch (error) {
            console.error('Error getting session after Google login:', error);
          }
        }}>
            <Image
              src={`/icons/google-logo.png`}
              alt={`Google logo`}
              width={24}
              height={24}
            />

          {text}
        </button>
      </div>
    );
}

export default GoogleAuthButton;