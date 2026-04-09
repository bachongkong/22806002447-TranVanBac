import { Outlet } from 'react-router-dom';
import { Header } from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { ParticleBackground } from '@shared/components/effects/ParticleBackground';

/**
 * MainLayout — Layout cho trang public (Landing, Login, Register, Jobs)
 */
export default function MainLayout() {
  return (
    <div className="relative min-h-screen font-body overflow-x-hidden">
      {/* Background Particles layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <ParticleBackground showRings={true} />
      </div>

      <Header />

      <main className="flex flex-col items-center w-full relative z-10 pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
