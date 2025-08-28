
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const onboardingSteps = [
  {
    image: 'https://picsum.photos/800/600',
    aiHint: 'financial transaction digital payment',
    title: 'Welcome to BrillPrime!',
    description:
      'The future of urban mobility and services. Your all-in-one solution for smart fuel delivery, local shopping, and automated toll payments.',
  },
  {
    image: 'https://picsum.photos/800/600',
    aiHint: 'fuel delivery service',
    title: 'On-Demand Fuel, Delivered',
    description:
      'Never wait in line at a gas station again. Order fuel directly to your location with just a few taps. Fast, reliable, and convenient.',
  },
  {
    image: 'https://picsum.photos/800/600',
    aiHint: 'online shopping e-commerce',
    title: 'Shop Local, Effortlessly',
    description:
      'Discover and buy from the best local merchants. Our e-marketplace connects you with your community, offering everything from groceries to services.',
  },
  {
    image: 'https://picsum.photos/800/600',
    aiHint: 'contactless payment toll road',
    title: 'Seamless Toll Payments',
    description:
      'Drive through tolls without ever stopping. Our smart system handles payments automatically, making your journey smoother.',
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('hasSeenOnboarding', 'true');
      router.push('/signup');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    router.push('/web');
  }

  const { image, aiHint, title, description } = onboardingSteps[currentStep];

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="relative h-2/5 md:h-1/2 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          data-ai-hint={aiHint}
        />
      </div>

      <div className="flex flex-col justify-between flex-1 p-8 md:p-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 my-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? 'w-6 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          {currentStep > 0 ? (
            <Button variant="ghost" size="icon" onClick={handlePrev} className="rounded-full">
              <ArrowLeft />
            </Button>
          ) : (
             <Button variant="ghost" onClick={handleSkip}>Skip</Button>
          )}

          <Button onClick={handleNext} className="rounded-full w-40">
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
