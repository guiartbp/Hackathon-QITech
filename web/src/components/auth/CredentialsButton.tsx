import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { Mail } from "lucide-react";

interface CredentialsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

function CredentialsButton({ children, className, ...props }: CredentialsButtonProps) {
  return ( 
    <button 
      type="submit" 
      className={cn("login-button relative text-white bg-orange-600 hover:bg-orange-700", className)}
      {...props}
    >
      <Mail className="w-[26px] h-[26px]" />
      {children}
    </button>
   );
}

export default CredentialsButton;