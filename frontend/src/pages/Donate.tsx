import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Droplet, Users } from 'lucide-react';
import { toast } from 'sonner';

const Donate = () => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    amount: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaystackPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.amount) {
      toast.error(t('donate.errorTitle'), {
        description: t('donate.errorRequired')
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount < 10) {
      toast.error(t('donate.errorTitle'), {
        description: t('donate.errorMinAmount')
      });
      return;
    }

    setIsProcessing(true);

    const handler = (window as any).PaystackPop.setup({
      key: 'pk_test_YOUR_PUBLIC_KEY',
      email: formData.email,
      amount: amount * 100,
      currency: 'KES',
      ref: 'TKN_' + Math.floor((Math.random() * 1000000000) + 1),
      metadata: {
        custom_fields: [
          {
            display_name: "Full Name",
            variable_name: "full_name",
            value: formData.fullName
          },
          {
            display_name: "Message",
            variable_name: "message",
            value: formData.message || "No message"
          }
        ]
      },
      callback: function(response: any) {
        toast.success(t('donate.successTitle'), {
          description: t('donate.successDesc')
        });
        setFormData({
          fullName: '',
          email: '',
          amount: '',
          message: ''
        });
        setIsProcessing(false);
      },
      onClose: function() {
        setIsProcessing(false);
      }
    });

    handler.openIframe();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20">
        <section className="bg-gradient-to-b from-green-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="flex justify-center mb-4">
                <Heart className="h-16 w-16 text-red-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                {t('donate.title')}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('donate.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-2">
                    <Droplet className="h-10 w-10 text-blue-500" />
                  </div>
                  <CardTitle className="text-center">{t('donate.waterTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {t('donate.waterDesc')}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-2">
                    <Heart className="h-10 w-10 text-red-500" />
                  </div>
                  <CardTitle className="text-center">{t('donate.foodTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {t('donate.foodDesc')}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-2">
                    <Users className="h-10 w-10 text-green-500" />
                  </div>
                  <CardTitle className="text-center">{t('donate.emergencyTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {t('donate.emergencyDesc')}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">{t('donate.formTitle')}</CardTitle>
                <CardDescription>{t('donate.formDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaystackPayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('donate.fullName')}</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={t('donate.fullNamePlaceholder')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('donate.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('donate.emailPlaceholder')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">{t('donate.amount')}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        KES
                      </span>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min="10"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="1000"
                        className="pl-14"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500">{t('donate.amountNote')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('donate.message')}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t('donate.messagePlaceholder')}
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? t('donate.processing') : t('donate.donateButton')}
                  </Button>

                  <p className="text-sm text-center text-gray-500">
                    {t('donate.secureNote')}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
