'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Bell, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';

interface ComingSoonPageProps {
  serviceName: string;
  description: string;
  icon?: React.ReactNode;
}

/**
 * ComingSoonPage Component
 * Reusable component for services that are not yet implemented
 * Includes email notification signup form
 */
export function ComingSoonPage({ serviceName, description, icon }: ComingSoonPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Thanks! We\'ll notify you when this service is ready.');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="max-w-2xl w-full">
        <Card padding="lg" className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              {icon || <Rocket size={40} className="text-primary" />}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-text-primary mb-3">
            {serviceName} Coming Soon
          </h1>

          {/* Description */}
          <p className="text-text-secondary mb-8 text-lg">
            {description}
          </p>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/20 text-warning rounded-full mb-8">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Under Development</span>
          </div>

          {/* Notify Me Form */}
          <div className="max-w-md mx-auto mb-8">
            <form onSubmit={handleNotifyMe} className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Bell size={18} />}
                className="flex-1"
              />
              <Button type="submit" loading={loading}>
                Notify Me
              </Button>
            </form>
            <p className="text-xs text-text-muted mt-2">
              We'll send you an email when this service is ready to use.
            </p>
          </div>

          {/* Back to Dashboard */}
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft size={18} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted">
            Want to contribute or learn more?{' '}
            <a href="https://github.com" className="text-primary hover:underline">
              Check out our GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
