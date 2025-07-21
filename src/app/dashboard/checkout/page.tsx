
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrderById, type Order } from '@/services/memberService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CreditCard } from 'lucide-react';

function CheckoutPageContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { toast } = useToast();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            toast({ title: 'No Order ID Found', description: 'Returning to dashboard.', variant: 'destructive' });
            // In a real app, maybe redirect: router.push('/dashboard');
            setIsLoading(false);
            return;
        }

        const fetchOrder = async () => {
            setIsLoading(true);
            try {
                // In a real app, this would be a Firestore call.
                const fetchedOrder = await getOrderById(orderId);


                if (fetchedOrder) {
                    setOrder(fetchedOrder);
                } else {
                    toast({ title: 'Order Not Found', description: `Could not find draft order ${orderId}`, variant: 'destructive' });
                }
            } catch (error) {
                console.error("Failed to fetch order:", error);
                toast({ title: 'Error', description: 'There was a problem loading your order.', variant: 'destructive' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();

    }, [orderId, toast]);

    if (isLoading) {
        return <CheckoutSkeleton />;
    }

    if (!order) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle/> Order Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>We couldn't load the details for this order. It may have been deleted or there was an error.</p>
                </CardContent>
            </Card>
        );
    }

    const tax = order.totalAmount * 0.08; // Example 8% tax
    const finalTotal = order.totalAmount + tax;

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Complete Your Order</CardTitle>
                <CardDescription>Review your order details and proceed to payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold">Order Summary</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Card(s) ({order.items.length} recipients)</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Estimated Tax</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="space-y-4">
                     <h3 className="font-semibold">Shipping To</h3>
                     {order.items.map(item => (
                        <div key={item.recipientUserId} className="text-sm p-3 bg-secondary rounded-md">
                            <p className="font-medium">{item.recipientName}</p>
                            <p className="text-muted-foreground">{item.recipientAddress.city}, {item.recipientAddress.state}</p>
                        </div>
                     ))}
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold">Payment</h3>
                    <div className="p-6 border-dashed border-2 rounded-lg text-center text-muted-foreground">
                        <p>Stripe / Avalara Integration Here</p>
                        <p className="text-xs">(Payment form would be loaded)</p>
                    </div>
                </div>

            </CardContent>
            <CardFooter>
                <Button size="lg" className="w-full">
                    <CreditCard className="mr-2"/>
                    Pay ${finalTotal.toFixed(2)}
                </Button>
            </CardFooter>
        </Card>
    );
}

const CheckoutSkeleton = () => (
    <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
             <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-16 w-full" />
            </div>
             <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
            </div>
        </CardContent>
        <CardFooter>
            <Skeleton className="h-12 w-full" />
        </CardFooter>
    </Card>
);

export default function CheckoutPage() {
    return (
        <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutPageContent />
        </Suspense>
    );
}
