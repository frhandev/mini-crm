import { Contact, CircleCheck, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const technologies = ['Tailwind CSS', 'shadcn/ui', 'Path Aliases'];

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-2xl space-y-4">
        <header className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Contact className="size-6" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Mini CRM</h1>

          <p className="text-sm text-muted-foreground">UI Configuration Preview</p>
        </header>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Frontend Configuration</CardTitle>

              <Badge className="bg-emerald-100 text-emerald-700">Ready</Badge>
            </div>

            <CardDescription>Tailwind CSS and shadcn/ui component preview.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <Separator />

            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>

                <Input
                  id="customerName"
                  name="customerName"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit">
                  <Plus className="size-4" />
                  Create Customer
                </Button>

                <Button type="reset" variant="outline">
                  Cancel
                </Button>

                <Button type="button" disabled>
                  Disabled
                </Button>
              </div>
            </form>

            <Separator />

            <div className="space-y-4">
              {technologies.map((technology) => (
                <div key={technology} className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CircleCheck className="size-4 text-emerald-600" />

                    <span>{technology}</span>
                  </div>

                  <span className="text-muted-foreground">Configured</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-sm text-muted-foreground">
          Mini CRM · v0.1.0 · Development Preview
        </footer>
      </div>
    </main>
  );
}

export default App;
