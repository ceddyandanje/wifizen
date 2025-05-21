// src/ai/flows/suggest-device-name.ts
'use server';
/**
 * @fileOverview Suggests a human-readable name for a connected device based on its properties.
 *
 * - suggestDeviceName - A function that suggests a device name.
 * - SuggestDeviceNameInput - The input type for the suggestDeviceName function.
 * - SuggestDeviceNameOutput - The return type for the suggestDeviceName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDeviceNameInputSchema = z.object({
  deviceType: z.string().describe('The type of the device (e.g., smartphone, laptop, smart TV).'),
  manufacturer: z.string().describe('The manufacturer of the device (e.g., Samsung, Apple, LG).'),
  model: z.string().describe('The model of the device (e.g., Galaxy S21, MacBook Pro, OLED65C1).'),
  userProvidedName: z.string().optional().describe('The current name of the device provided by the user'),
});
export type SuggestDeviceNameInput = z.infer<typeof SuggestDeviceNameInputSchema>;

const SuggestDeviceNameOutputSchema = z.object({
  suggestedName: z.string().describe('A human-readable name for the device.'),
});
export type SuggestDeviceNameOutput = z.infer<typeof SuggestDeviceNameOutputSchema>;

export async function suggestDeviceName(input: SuggestDeviceNameInput): Promise<SuggestDeviceNameOutput> {
  return suggestDeviceNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDeviceNamePrompt',
  input: {schema: SuggestDeviceNameInputSchema},
  output: {schema: SuggestDeviceNameOutputSchema},
  prompt: `You are an expert in suggesting user-friendly names for devices connected to a home network.

  Based on the device's properties, suggest a concise and easily recognizable name.  Do not include the words 'device' or 'connected'.

  If the user has already provided a name, only suggest a new name if the existing name is clearly technical or nonsensical.

  Device Type: {{{deviceType}}}
  Manufacturer: {{{manufacturer}}}
  Model: {{{model}}}
  User Provided Name: {{#if userProvidedName}}{{{userProvidedName}}}{{else}}None{{/if}}
  `,
});

const suggestDeviceNameFlow = ai.defineFlow(
  {
    name: 'suggestDeviceNameFlow',
    inputSchema: SuggestDeviceNameInputSchema,
    outputSchema: SuggestDeviceNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
