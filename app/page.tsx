import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { HomePage } from '@/components/home-page';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <HomePage />
      <SiteFooter />
    </div>
  );
}
