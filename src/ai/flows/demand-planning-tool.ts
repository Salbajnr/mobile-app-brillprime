'use server';

/**
 * @fileOverview AI tool that suggests the most optimal time for drivers to fulfill the demand.
 *
 * - demandPlanningTool - A function that suggests the most optimal time for drivers to fulfill the demand.
 * - DemandPlanningInput - The input type for the demandPlanningTool function.
 * - DemandPlanningOutput - The return type for the demandPlanningTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DemandPlanningInputSchema = z.object({
  location: z.string().describe('The current location of the driver.'),
  fuelType: z.string().describe('The type of fuel the driver is delivering.'),
  currentDemand: z.number().describe('The current demand for fuel in liters.'),
  historicalData: z
    .string()
    .describe(
      'Historical data of fuel demand in the area, including time of day and day of week.'
    ),
});
export type DemandPlanningInput = z.infer<typeof DemandPlanningInputSchema>;

const DemandPlanningOutputSchema = z.object({
  optimalTime: z
    .string()
    .describe(
      'The optimal time to fulfill fuel delivery requests, based on the input data.'
    ),
  predictedDemand: z
    .number()
    .describe(
      'The predicted demand for fuel at the optimal time, in liters.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the optimal time suggestion, based on the input data.'
    ),
});
export type DemandPlanningOutput = z.infer<typeof DemandPlanningOutputSchema>;

export async function demandPlanningTool(
  input: DemandPlanningInput
): Promise<DemandPlanningOutput> {
  return demandPlanningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demandPlanningPrompt',
  input: {schema: DemandPlanningInputSchema},
  output: {schema: DemandPlanningOutputSchema},
  prompt: `You are an AI assistant that suggests the most optimal time for drivers to fulfill fuel delivery requests, so they can maximize their efficiency and earnings.

You will be provided with the driver's current location, the type of fuel they are delivering, the current demand for fuel, and historical data of fuel demand in the area.

Based on this information, you will determine the optimal time to fulfill fuel delivery requests, and the predicted demand for fuel at that time.

Here is the driver's current location: {{{location}}}
Here is the type of fuel the driver is delivering: {{{fuelType}}}
Here is the current demand for fuel: {{{currentDemand}}} liters
Here is the historical data of fuel demand in the area: {{{historicalData}}}

Consider all these factors when determining the optimal time to fulfill fuel delivery requests. The optimal time should be in HH:mm format.
Also provide the reasoning behind the decision in a concise manner.
`,
});

const demandPlanningFlow = ai.defineFlow(
  {
    name: 'demandPlanningFlow',
    inputSchema: DemandPlanningInputSchema,
    outputSchema: DemandPlanningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
