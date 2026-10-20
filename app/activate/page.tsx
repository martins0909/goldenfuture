import Link from 'next/link';
import { Logo } from '@/components/site-chrome';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivationForm } from '@/components/activation-form';

export default async function ActivatePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token: searchToken } = await searchParams;
  const token = searchToken ?? '';
  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <header className="border-b border-border bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8"><Link href="/"><Logo /></Link></div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Set up your member account</CardTitle>
            <CardDescription>Create a password to access your cooperative membership and personal financial records.</CardDescription>
          </CardHeader>
          <CardContent>
            {token ? <ActivationForm token={token} /> : <p role="alert" className="text-sm text-destructive">This invitation link is missing its activation token.</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
