'use server';

import { z } from 'zod';
import {
  demandPlanningTool,
  type DemandPlanningOutput,
} from '@/ai/flows/demand-planning-tool';

export const DemandPlanningInputSchema = z.object({
  location: z.string().min(1, { message: 'Location is required.' }),
  fuelType: z.string().min(1, { message: 'Please select a fuel type.' }),
  currentDemand: z.coerce
    .number({ invalid_type_error: 'Demand must be a number.' })
    .positive({ message: 'Current demand must be a positive number.' }),
  historicalData: z
    .string()
    .min(1, { message: 'Historical data is required.' }),
});

export type FormState = {
  message: string;
  data?: DemandPlanningOutput;
  errors?: {
    location?: string[];
    fuelType?: string[];
    currentDemand?: string[];
    historicalData?: string[];
  };
};

export async function getDemandPrediction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = DemandPlanningInputSchema.safeParse({
    location: formData.get('location'),
    fuelType: formData.get('fuelType'),
    currentDemand: formData.get('currentDemand'),
    historicalData: formData.get('historicalData'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await demandPlanningTool(validatedFields.data);
    return { message: 'Success', data: result };
  } catch (error) {
    console.error(error);
    return { message: 'AI processing failed. Please try again later.' };
  }
}
