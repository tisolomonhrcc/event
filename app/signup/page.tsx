'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    jobIndustry: '',
    playTitle: '',
    gender: '',
  });

  const generateTicketCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `HRCC-${randomNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.fullName || !formData.whatsapp || !formData.jobIndustry || !formData.playTitle || !formData.gender) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Ghana phone validation: +233 followed by 9 digits or 0 followed by 9 digits
    const ghanaPhoneRegex = /^(?:\+233|0)[235][0-9]{8}$/;
    if (!ghanaPhoneRegex.test(formData.whatsapp.replace(/\s/g, ''))) {
      setError('Please enter a valid Ghanaian WhatsApp number (e.g. 024XXXXXXX or +23324XXXXXXX)');
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch Gifts
      const { data: gifts, error: giftsError } = await supabase
        .from('gifts')
        .select('*');

      if (giftsError || !gifts) {
        throw new Error('Failed to fetch gifts');
      }

      const hairBand = gifts.find(g => g.name === 'hair band');
      const tissue = gifts.find(g => g.name === 'tissue');

      if (!hairBand || !tissue) {
        throw new Error('Gifts not configured correctly');
      }

      // 2. Determine Possible Gifts for this user
      let possibleGifts = [];
      
      // Check if hair band is an option
      if (hairBand.remaining_stock > 0) {
        if (formData.gender === 'Male') {
          if (hairBand.men_given < 20) {
            possibleGifts.push(hairBand);
          }
        } else {
          // Female
          const womenLimit = hairBand.total_stock - hairBand.max_for_men; // 80
          const womenGiven = hairBand.total_stock - hairBand.remaining_stock - hairBand.men_given;
          if (womenGiven < womenLimit) {
            possibleGifts.push(hairBand);
          }
        }
      }

      // Check if tissue is an option
      if (tissue.remaining_stock > 0) {
        possibleGifts.push(tissue);
      }

      if (possibleGifts.length === 0) {
        setError('we are currently out of stock. Kindly contact the administrator');
        setLoading(false);
        return;
      }

      // Randomly pick from possible gifts
      const assignedGift = possibleGifts[Math.floor(Math.random() * possibleGifts.length)];

      const ticketCode = generateTicketCode();

      // 3. Update stock and insert signup
      const { error: stockError } = await supabase
        .from('gifts')
        .update({
          remaining_stock: assignedGift.remaining_stock - 1,
          men_given: formData.gender === 'Male' && assignedGift.name === 'hair band' 
            ? assignedGift.men_given + 1 
            : assignedGift.men_given
        })
        .eq('id', assignedGift.id);

      if (stockError) throw stockError;

      const { data, error: insertError } = await supabase
        .from('event_signups')
        .insert([
          {
            full_name: formData.fullName,
            whatsapp: formData.whatsapp,
            job_role: formData.jobIndustry,
            play_title: formData.playTitle,
            gender: formData.gender,
            gift_id: assignedGift.id,
            ticket_code: ticketCode,
          },
        ])
        .select()
        .maybeSingle();

      if (insertError) {
        // Rollback stock if signup fails (simple rollback)
        await supabase
          .from('gifts')
          .update({
            remaining_stock: assignedGift.remaining_stock,
            men_given: assignedGift.men_given
          })
          .eq('id', assignedGift.id);

        if (insertError.code === '23505') {
          setError('This WhatsApp number is already registered');
        } else {
          setError('Failed to submit. Please try again.');
        }
        setLoading(false);
        return;
      }

      if (data) {
        localStorage.setItem('ticketCode', ticketCode);
        localStorage.setItem('giftName', assignedGift.name);
        router.push('/gift');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center mb-6">
          <Image
            src="https://hrccattendance.netlify.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogohr.b7d53c0a.jpg&w=2048&q=75"
            alt="Logo"
            width={150}
            height={60}
            className="rounded-xl shadow-sm"
          />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Sign Up for Your Gift
          </h2>
          <p className="text-muted-foreground">
            Complete the form to unlock your special surprise.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground font-semibold ml-1">
              Full Name <span className="text-primary">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-foreground font-semibold ml-1">
              WhatsApp Number <span className="text-primary">*</span>
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. 024XXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-semibold ml-1">
              Gender <span className="text-primary">*</span>
            </Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              className="flex space-x-4 ml-1"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-foreground font-semibold ml-1">
              Industry <span className="text-primary">*</span>
            </Label>
            <Input
              id="industry"
              type="text"
              required
              value={formData.jobIndustry}
              onChange={(e) => setFormData({ ...formData, jobIndustry: e.target.value })}
              className="focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Technology, Banking, Healthcare"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="playTitle" className="text-foreground font-semibold ml-1">
              If we replaced today's show with your job title… what would the title of the play be? <span className="text-primary">*</span>
            </Label>
            <Textarea
              id="playTitle"
              required
              rows={3}
              value={formData.playTitle}
              onChange={(e) => setFormData({ ...formData, playTitle: e.target.value })}
              className="focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="e.g. HR Manager: The Negotiator"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Unlock My Gift 🎁'}
          </Button>
        </form>
      </div>
    </div>
  );
}
