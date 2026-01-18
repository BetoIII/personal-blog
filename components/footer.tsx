import Link from "next/link";

const footerLinks = {
  about: [
    { label: "Blog", href: "/blog" },
    { label: "Portfolio", href: "/portfolio" },
  ],
  ai: [
    { label: "ROI Calculator", href: "/roi-calculator" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-secondary overflow-hidden">
      {/* Decorative top border */}
      <div className="w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand section */}
          <div className="md:col-span-5">
            <h3 className="font-serif text-3xl font-medium mb-4">
              Beto Juárez III
            </h3>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              GTM & AI Advisor
            </p>
          </div>

          {/* Links sections */}
          <div className="md:col-span-7 grid grid-cols-2 gap-8">
            {/* About column */}
            <div>
              <h4 className="font-serif text-lg font-medium mb-6 uppercase tracking-wider text-sm thick-border-bottom pb-2 inline-block">
                About
              </h4>
              <ul className="space-y-3">
                {footerLinks.about.map((link) => (
                  <li key={`about-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-block hover:translate-x-1 transform"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI column */}
            <div>
              <h4 className="font-serif text-lg font-medium mb-6 uppercase tracking-wider text-sm thick-border-bottom pb-2 inline-block">
                AI
              </h4>
              <ul className="space-y-3">
                {footerLinks.ai.map((link) => (
                  <li key={`ai-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-block hover:translate-x-1 transform"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Beto Juárez III. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent opacity-5 rounded-full transform translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
    </footer>
  );
}
