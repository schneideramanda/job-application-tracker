'use client';

import { BriefcaseIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { signOut, useSession } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    const result = await signOut();

    if (result.data) {
      router.push('/sign-in');
    } else {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="border-b border-border">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <BriefcaseIcon />
          Job Tracker
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-secondary">
                        {session.user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleSignOut}>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/80">Start for free</Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
