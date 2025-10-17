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
      const response = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
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

            <Card className="max-w-2xl mx-auto">
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
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default Contact;
