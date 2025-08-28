'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useEffect, useState } from 'react';

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
import {
  BrainCircuit,
  Clock,
  Fuel,
  Lightbulb,
  Loader2,
  History,
} from 'lucide-react';
import { db } from '@/lib/db';
import { demandPredictions } from '@/lib/db/schema';
import type { DemandPrediction } from '@/lib/db/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full rounded-full" disabled={pending}>
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

export default function AdminDemandPlanningPage() {
  const [state, formAction] = useFormState(getDemandPrediction, initialState);
  const { toast } = useToast();
  const [predictions, setPredictions] = useState<DemandPrediction[]>([]);

  useEffect(() => {
    async function fetchPredictions() {
      const result = await db.select().from(demandPredictions);
      setPredictions(result);
    }
    fetchPredictions();
  }, [state]); // Refetch when form is submitted

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
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <Card className="rounded-2xl">
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
                  className="rounded-xl"
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
                  <SelectTrigger className="rounded-xl">
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
                  className="rounded-xl"
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
                  placeholder="e.g., 'High demand on weekday mornings, peak on Friday evenings.'"
                  className="min-h-[100px] rounded-xl"
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

        <Card className="flex flex-col rounded-2xl">
          <CardHeader>
            <CardTitle>Latest Prediction</CardTitle>
            <CardDescription>
              AI-powered suggestions will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {state.data ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Optimal Time
                    </h3>
                    <p className="text-2xl font-bold">
                      {state.data.optimalTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
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
                  <div className="rounded-full bg-blue-100 p-3">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Reasoning
                    </h3>
                    <p className="text-muted-foreground">
                      {state.data.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-gray-50">
                <div className="text-center text-muted-foreground">
                  <BrainCircuit className="mx-auto h-12 w-12" />
                  <p className="mt-4">
                    Your prediction results will be shown here.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="rounded-2xl h-full">
          <CardHeader>
            <CardTitle>Prediction History</CardTitle>
            <CardDescription>
              A log of all past demand predictions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Optimal Time</TableHead>
                    <TableHead>Predicted Demand</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictions.length > 0 ? (
                    predictions.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{p.location}</TableCell>
                        <TableCell>{p.fuelType}</TableCell>
                        <TableCell className="font-medium">
                          {p.optimalTime}
                        </TableCell>
                        <TableCell>
                          {Number(p.predictedDemand).toLocaleString()} L
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No prediction history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
