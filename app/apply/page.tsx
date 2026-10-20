'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/site-chrome';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';

const membershipCategories = ['Executive', 'Member'];

const contributionPlans = ['voluntary/custom'];

export default function ApplyPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    residential_address: '',
    occupation: '',
    next_of_kin: '',
    membership_category: '',
    contribution_plan: '',
  });
  const [agreed, setAgreed] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agreed) {
      setError('You must accept the cooperative rules, privacy policy, and membership terms to apply.');
      return;
    }
    setSubmitting(true);

    const response = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Your application could not be submitted.');
      setSubmitting(false);
      return;
    }
    setSuccess(true);
    setSubmitting(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/"><Logo /></Link>
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Member Login
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to homepage
        </Link>

        {success ? (
          <Card className="border-border shadow-lg">
            <CardContent className="flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Application Received</h1>
              <p className="mt-3 max-w-md text-muted-foreground">
                Thank you for applying to join Golden Future Multipurpose Cooperative Society. Our
                membership officer will review your application and contact you with next steps.
              </p>
              <Link href="/">
                <Button className="mt-8">Return to Homepage</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-2xl">Membership Application</CardTitle>
                  <CardDescription>
                    Complete this form to apply for membership. All applications are reviewed and approved by the executive committee.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full name *</Label>
                    <Input id="full_name" required value={form.full_name} onChange={(e) => update('full_name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address *</Label>
                    <Input id="email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number *</Label>
                    <Input id="phone" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+234 ..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of birth</Label>
                    <Input id="date_of_birth" type="date" value={form.date_of_birth} onChange={(e) => update('date_of_birth', e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residential_address">Residential address</Label>
                  <Textarea id="residential_address" value={form.residential_address} onChange={(e) => update('residential_address', e.target.value)} rows={2} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation / Profession *</Label>
                    <Input id="occupation" required value={form.occupation} onChange={(e) => update('occupation', e.target.value)} placeholder="e.g. Civil Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="next_of_kin">Next of kin</Label>
                    <Input id="next_of_kin" value={form.next_of_kin} onChange={(e) => update('next_of_kin', e.target.value)} placeholder="Name and phone" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Membership category *</Label>
                    <Select onValueChange={(v) => update('membership_category', v)}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {membershipCategories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Contribution plan *</Label>
                    <Select onValueChange={(v) => update('contribution_plan', v)}>
                      <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                      <SelectContent>
                        {contributionPlans.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4">
                  <Checkbox id="agree" checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} />
                  <Label htmlFor="agree" className="text-sm leading-relaxed text-muted-foreground">
                    I confirm that the information provided is accurate, and I accept the cooperative rules,
                    privacy policy, and membership terms. I understand that submission does not guarantee
                    membership — my application will be reviewed and approved by the executive committee.
                  </Label>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
