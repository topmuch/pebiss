'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  Search,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = session?.user?.role === 'ADMIN';
  const isEnterprise = session?.user?.role === 'ENTERPRISE';
  const isAuth = status === 'authenticated';
  const isHome = pathname === '/';

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/annuaire', label: 'Annuaire' },
    { href: '/annonces', label: 'Annonces' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`z-50 w-full transition-colors duration-300 ${
        isHome
          ? 'absolute top-0 left-0 right-0 bg-transparent'
          : 'sticky top-0 bg-white/95 backdrop-blur border-b border-border'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/pebiss-logo.jpeg"
            alt="Pebiss"
            width={140}
            height={44}
            className={`h-11 w-auto object-contain ${isHome ? 'brightness-0 invert' : ''}`}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isHome
                  ? isActive(link.href)
                    ? 'text-white font-semibold'
                    : 'text-white/80 hover:text-white'
                  : isActive(link.href)
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {(isEnterprise || isAdmin) && (
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Tableau de bord
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    Administration
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm ${isHome ? 'text-white/90 hover:text-white hover:bg-white/10' : ''}`}
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  Inscription
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden ${isHome ? 'text-white hover:bg-white/10' : ''}`}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src="/pebiss-logo.jpeg"
                    alt="Pebiss"
                    width={100}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuth ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4 inline" />
                      Tableau de bord
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Shield className="mr-2 h-4 w-4 inline" />
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 text-left"
                    >
                      <LogOut className="mr-2 h-4 w-4 inline" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 mt-4 px-4">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        Inscription
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
