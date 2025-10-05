import LoginForm from './LoginForm';
import Image from 'next/image';
function LoginPage() {
  return ( 
    <main className="lg:h-screen flex">
      <div className="w-[55%] h-full flex flex-col gap-8 items-center justify-center bg-black">
        <LoginForm />
      </div>

      <div className="h-full w-[45%] flex flex-col items-center py-32 bg-gradient-to-br from-orange-600 to-orange-700 relative">
<div className="absolute inset-0 flex items-center justify-center z-0">
  <Image
    src="/logo-will.png"
    alt="Will Logo"
    width={1000}
    height={1000}
    className="object-contain opacity-70"
  />
</div>
        <div className="text-white flex gap-4 relative z-10">
          <h1 className="font-bold text-[64px] leading-16">Bem vindo de volta!</h1>

        </div>
      </div>
    </main>
   );
}

export default LoginPage;



/**
 * Add the logo image in the center of the left-side (black) panel.
 * You can use the Next.js Image component or a regular img tag.
 * Here, we'll use a regular img tag for simplicity.
 */

{/* Logo in the center of the left panel */}
{/* Place this inside the first <div> before <LoginForm /> */}
{/* 
  <img
    src="/logo-will.png"
    alt="Will Logo"
    className="w-32 h-32 mb-8"
  />
*/}
