import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import axios from 'axios';


const FAQList: React.FC = () => {
  const faqs: { q: string; a: string }[] = [
    {
      q: 'How do I report a broken water point?',
      a: 'Use this contact form or call the phone number provided. Please include the water source name or coordinates and a brief description of the problem.'
    },
    {
      q: 'Can I add a new water source to the map?',
      a: 'Yes — send details (location, type, condition) via this contact form and our team will verify and add it to the map.'
    },
    {
      q: 'How often is the data updated?',
      a: 'We update records when new reports are verified; community partners and volunteers help keep the map current.'
    },
    {
      q: 'Which languages are supported on the site?',
      a: 'The site supports multiple local dialects; choose your preferred language from the selector in the header.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4 ">
      {faqs.map((f, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="p-3 rounded-lg bg-transparent">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="text-left w-full flex items-center gap-3"
                >
                  <span className="text-base font-semibold">{f.q}</span>
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-label={open ? 'Collapse' : 'Expand'}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100"
                >
                  <span className="text-lg font-bold">{open ? '\u2212' : '+'}</span>
                </button>
              </div>
            </div>

            <div className={`mt-3 text-sm text-muted-foreground ${open ? 'block' : 'hidden'}`}>
              {f.a}
            </div>

            <div className="mt-4">
              <hr className="border-t border-muted-foreground" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8000/api/contact/', formData, {
        headers:{
          "Content-Type":"application/json"
        },
      });

      if (response.status === 200 || response.status === 201 ) {
        toast({
          title: t('contact.successTitle'),
          description: t('contact.successDesc'),
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: t('contact.errorTitle'),
        description: t('contact.errorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('contact.title')}</h1>
              <p className="text-lg text-muted-foreground">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full mx-auto mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <CardTitle>{t('contact.email')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">info@wateraccessturkana.org</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full mx-auto mb-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <CardTitle>{t('contact.phone')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">+254 700 000 000</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full mx-auto mb-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <CardTitle>{t('contact.location')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{t('contact.locationValue')}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{t('contact.formTitle')}</CardTitle>
                  <CardDescription>
                    {t('contact.formDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contact.name')} *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder={t('contact.namePlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact.email')} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder={t('contact.emailPlaceholder')}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('contact.phone')}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t('contact.phonePlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{t('contact.subject')} *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder={t('contact.subjectPlaceholder')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.message')} *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.messagePlaceholder')}
                        rows={6}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? t('contact.sending') : t('contact.sendButton')}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-none bg-muted">
                <CardHeader>
                  <CardTitle>{t('contact.faqTitle', 'Frequently Asked Questions')}</CardTitle>
                  <CardDescription>{t('contact.faqSubtitle', '')}</CardDescription>
                </CardHeader>
                <CardContent>
               
                  {(
                    [
                      {
                        q: 'How do I report a broken water point?',
                        a: 'Use this contact form or call the phone number provided. Please include the water source name or coordinates and a brief description of the problem.'
                      },
                      {
                        q: 'Can I add a new water source to the map?',
                        a: 'Yes — send details (location, type, condition) via this contact form and our team will verify and add it to the map.'
                      },
                      {
                        q: 'How often is the data updated?',
                        a: 'We update records when new reports are verified; community partners and volunteers help keep the map current.'
                      },
                      {
                        q: 'Which languages are supported on the site?',
                        a: 'The site supports multiple local dialects; choose your preferred language from the selector in the header.'
                      }
                    ] as { q: string; a: string }[]
                  ).map((item, idx) => null)}

                
                  <FAQList />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default Contact;
