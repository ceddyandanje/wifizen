
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays, isValid, parseISO } from "date-fns";
import type { Subscription } from "@/types";
import { MOCK_SUBSCRIPTIONS, addMockSubscription, removeMockSubscription } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const subscriptionFormSchema = z.object({
  name: z.string().min(1, "Subscription name is required."),
  paymentDate: z.date({ required_error: "Next payment date is required." }),
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load subscriptions from localStorage or use mock
    const storedSubs = localStorage.getItem("wifiZenSubscriptions");
    let initialSubs: Subscription[];

    if (storedSubs) {
      try {
        // Ensure date objects are correctly parsed
        initialSubs = JSON.parse(storedSubs).map((s: any) => ({
          ...s,
          paymentDate: s.paymentDate ? new Date(parseISO(s.paymentDate)) : new Date(),
        }));
      } catch (e) {
        console.error("Failed to parse subscriptions from localStorage, using mocks:", e);
        initialSubs = MOCK_SUBSCRIPTIONS.map(s => ({
          ...s,
          paymentDate: s.paymentDate ? new Date(s.paymentDate) : new Date(),
        }));
      }
    } else {
      initialSubs = MOCK_SUBSCRIPTIONS.map(s => ({
        ...s,
        paymentDate: s.paymentDate ? new Date(s.paymentDate) : new Date(),
      }));
    }
    
    setSubscriptions(initialSubs.sort((a,b) => differenceInDays(a.paymentDate, new Date()) - differenceInDays(b.paymentDate, new Date())));
  }, []);

  useEffect(() => {
    // Persist subscriptions to localStorage whenever they change,
    // but only if it's not the initial empty state before MOCK_SUBSCRIPTIONS are loaded.
    if (subscriptions.length > 0 || localStorage.getItem("wifiZenSubscriptions")) { 
        // Store dates as ISO strings for reliable parsing
        localStorage.setItem("wifiZenSubscriptions", JSON.stringify(
            subscriptions.map(s => ({...s, paymentDate: s.paymentDate.toISOString()}))
        ));
    }
  }, [subscriptions]);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
        name: "",
        paymentDate: undefined,
    }
  });

  function onSubmit(values: SubscriptionFormValues) {
    const newSubscription = addMockSubscription(values); 
    setSubscriptions(prev => [...prev, newSubscription].sort((a,b) => differenceInDays(a.paymentDate, new Date()) - differenceInDays(b.paymentDate, new Date())));
    form.reset({name: "", paymentDate: undefined});
    toast({ title: "Subscription Added", description: `${values.name} has been added to your tracker.` });
  }

  const handleDeleteSubscription = (id: string) => {
    const subName = subscriptions.find(s => s.id === id)?.name || "Subscription";
    removeMockSubscription(id); 
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    toast({ title: "Subscription Removed", description: `${subName} has been removed.` });
  };

  const getDaysRemainingText = (paymentDate: Date) => {
    if (!isValid(paymentDate)) return "Invalid date";
    const today = new Date();
    today.setHours(0,0,0,0); 
    
    const daysRemaining = differenceInDays(paymentDate, today);

    if (daysRemaining < 0) return `Overdue by ${Math.abs(daysRemaining)} day(s)`;
    if (daysRemaining === 0) return "Due today";
    return `Due in ${daysRemaining} day(s)`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription Tracker</h1>
        <p className="text-muted-foreground">Keep track of your recurring payments.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Add New Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-4 items-end">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Netflix, Spotify" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Next Payment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate()-1)) } 
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Subscription
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <Card className="text-center py-10 shadow-md">
            <CardContent className="flex flex-col items-center gap-4">
              <Image src="https://placehold.co/300x200.png" alt="No subscriptions" width={300} height={200} data-ai-hint="empty state illustration" className="rounded-md" />
              <p className="text-muted-foreground">You haven&apos;t added any subscriptions yet. <br/> Use the form above to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subscriptions.map(sub => (
              <Card key={sub.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {sub.name}
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-7 w-7">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the subscription for &quot;{sub.name}&quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteSubscription(sub.id)} className={buttonVariants({ variant: "destructive" })}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardTitle>
                  <CardDescription>Next payment on: {isValid(sub.paymentDate) ? format(sub.paymentDate, "MMMM dd, yyyy") : "Invalid Date"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                      "text-lg font-semibold",
                      isValid(sub.paymentDate) && differenceInDays(sub.paymentDate, new Date(new Date().setHours(0,0,0,0))) < 0 ? "text-destructive" :
                      isValid(sub.paymentDate) && differenceInDays(sub.paymentDate, new Date(new Date().setHours(0,0,0,0))) < 7 ? "text-yellow-500" : "text-green-600"
                    )}>
                    {getDaysRemainingText(sub.paymentDate)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

