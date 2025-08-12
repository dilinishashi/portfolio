import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useSupabase } from "@/context/SupabaseProvider";

const Header = () => {
  const { session } = useSupabase();
  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Hasan Bose</span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {session ? (
            <Link to="/admin/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          ) : (
            <Link to="/admin">
              <Button variant="ghost">Admin Sign In</Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );