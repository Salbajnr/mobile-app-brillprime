import { Button } from '@/components/ui/button';
import { ArrowRight, Fuel, ShoppingCart, Car } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    icon: <Fuel className="h-10 w-10 text-primary" />,
    title: 'On-Demand Fuel Delivery',
    description: 'Get fuel delivered right to your location, anytime. No more queues, no more hassle.',
  },
  {
    icon: <ShoppingCart className="h-10 w-10 text-primary" />,
    title: 'E-Marketplace',
    description: 'Shop for local products and services from trusted merchants in your area.',
  },
  {
    icon: <Car className="h-10 w-10 text-primary" />,
    title: 'Seamless Toll Payments',
    description: 'Drive through tolls without stopping. Our system handles payments automatically.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gray-50">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center px-6 py-24">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-6xl">
              The Future of Urban Mobility and Services
            </h1>
            <p className="text-lg text-muted-foreground">
              BrillPrime is your all-in-one solution for smart fuel delivery, local shopping, and automated toll payments, designed for the modern world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-80 lg:h-[500px] rounded-3xl overflow-hidden">
            <Image
              src="https://picsum.photos/1200/800"
              alt="Urban mobility illustration"
              fill
              className="object-cover"
              data-ai-hint="smart city mobility"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Everything You Need, in One App</h2>
            <p className="text-lg text-muted-foreground mt-2">
              Simplifying your daily life with intelligent solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
