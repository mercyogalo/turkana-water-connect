import { Droplet, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplet className="h-6 w-6" />
              <span className="font-bold text-lg">Water Access Turkana</span>
            </div>
            <p className="text-background/80">
              Helping communities in Turkana, Kenya find and access clean water sources.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-background/80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@wateraccessturkana.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Turkana County, Kenya</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-background/80">
              <a href="/" className="block hover:text-background transition-colors">
                Home
              </a>
              <a href="/water-sources" className="block hover:text-background transition-colors">
                Water Sources
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
          <p>&copy; {new Date().getFullYear()} Water Access Turkana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
