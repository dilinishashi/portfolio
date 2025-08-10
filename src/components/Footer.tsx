import { MadeWithDyad } from "./made-with-dyad";

const Footer = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0 animate-fade-in">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="#hero"
            className="font-medium underline underline-offset-4"
          >
            Hasan Bose
          </a>
          . All rights reserved. &copy; {new Date().getFullYear()}
        </p>
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;