const Footer = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0 animate-fade-in">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          Built by{" "}
          <a
            href="#hero"
            className="font-medium underline underline-offset-4"
          >
            Dilini Shashikala Leelarathna
          </a>
          . All rights reserved. &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
