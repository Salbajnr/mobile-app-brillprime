'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  getDemandPrediction,
  DemandPlanningInputSchema,
  type FormState,
} from './actions';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Clock, Fuel, Lightbulb, Loader2 } from 'lucide-react';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Predicting...
        </>
      ) : (
        <>
          <BrainCircuit className="mr-2 h-4 w-4" />
          Get Prediction
        </>
      )}
    </Button>
  );
}

export default function DemandPlanningPage() {
  const [state, formAction] = useFormState(getDemandPrediction, initialState);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof DemandPlanningInputSchema>>({
    resolver: zodResolver(DemandPlanningInputSchema),
    defaultValues: {
      location: '',
      fuelType: '',
      currentDemand: 0,
      historicalData: '',
    },
  });

  useEffect(() => {
    if (state.message && state.message !== 'Success') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Demand Planning Tool</CardTitle>
          <CardDescription>
            Enter details to predict optimal fuel delivery times.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Driver's Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Downtown, Financial District"
              />
              {state.errors?.location && (
                <p className="text-sm text-destructive">
                  {state.errors.location[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select name="fuelType">
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
               {state.errors?.fuelType && (
                <p className="text-sm text-destructive">
                  {state.errors.fuelType[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentDemand">Current Demand (Liters)</Label>
              <Input
                id="currentDemand"
                name="currentDemand"
                type="number"
                placeholder="e.g., 5000"
              />
               {state.errors?.currentDemand && (
                <p className="text-sm text-destructive">
                  {state.errors.currentDemand[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="historicalData">Historical Data</Label>
              <Textarea
                id="historicalData"
                name="historicalData"
                placeholder="Describe historical demand patterns. e.g., 'High demand on weekday mornings, peak on Friday evenings. Low on weekends.'"
                className="min-h-[100px]"
              />
               {state.errors?.historicalData && (
                <p className="text-sm text-destructive">
                  {state.errors.historicalData[0]}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Prediction Results</CardTitle>
          <CardDescription>
            AI-powered suggestions will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {state.data ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Optimal Time
                  </h3>
                  <p className="text-2xl font-bold">{state.data.optimalTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Fuel className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Predicted Demand
                  </h3>
                  <p className="text-2xl font-bold">
                    {state.data.predictedDemand.toLocaleString()} Liters
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Reasoning
                  </h3>
                  <p className="text-muted-foreground">{state.data.reasoning}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
              <div className="text-center text-muted-foreground">
                <BrainCircuit className="mx-auto h-12 w-12" />
                <p className="mt-4">Your prediction results will be shown here.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
