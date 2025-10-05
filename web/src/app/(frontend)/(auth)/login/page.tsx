import LoginForm from './LoginForm';
import Image from 'next/image';
function LoginPage() {
  return ( 
    <main className="lg:h-screen flex">
      <div className="w-[55%] h-full flex flex-col gap-8 items-center justify-center bg-black">
        <LoginForm />
      </div>

      {/* Right Side - Preview */}
      <div className="h-full w-[45%] bg-gradient-to-br from-orange-600 to-orange-700 text-white flex items-center justify-center p-10 relative">
        {/* Will Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <Image
            src="/logo-will.png"
            alt="Will Logo"
            width={800}
            height={800}
            className="object-contain opacity-20"
          />
        </div>
        
        <div className="max-w-md relative z-10">
          <h2 className="text-3xl font-bold mb-4">
            Potencialize seus investimentos de forma inteligente.
          </h2>
          <p className="mb-8 text-orange-100 text-lg">
            Acesse sua dashboard e monitore investimentos em SaaS com risco controlado.
          </p>
          
          {/* Dashboard Previews - Overlapping */}
          <div className="relative">
            <div className="relative">
              <Image
                src="/preview-1.png"
                alt="Dashboard Preview 1"
                width={400}
                height={250}
                className="rounded-2xl shadow-2xl border border-white/20 drop-shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-16 -right-8 z-10">
              <Image
                src="/preview-2.png"
                alt="Dashboard Preview 2"
                width={320}
                height={200}
                className="rounded-2xl shadow-2xl border border-white/20 drop-shadow-2xl shadow-black/50"
              />
            </div>
          </div>
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
