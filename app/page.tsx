import Features from '@/components/home/features';
import { Hero } from '@/components/home/hero';
import ImageTabs from '@/components/home/image-tabs';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <ImageTabs />
        <Features />
      </main>
    </div>
  );
}
