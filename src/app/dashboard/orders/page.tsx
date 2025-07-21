
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getMockOrders, type Order } from '@/services/memberService';
import { useToast } from '@/hooks/use-toast';
import { Package } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const statusVariantMap: { [key in Order['status']]: "default" | "secondary" | "destructive" | "outline" } = {
    delivered: "default",
    shipped: "default",
    processing: "secondary",
    draft: "outline"
};

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                // In a real app, this would fetch from Firestore, filtering by the current user's UID.
                const fetchedOrders = getMockOrders(); 
                setOrders(fetchedOrders.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                toast({
                    title: "Error",
                    description: "Could not fetch order history.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [toast]);

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold font-headline flex items-center gap-2"><Package /> Order History</h1>
                    <p className="text-muted-foreground">A record of all the cards you've sent and saved.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>My Orders</CardTitle>
                        <CardDescription>
                            Here's a list of your recent card orders. Click a row to see the card's content.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order Date</TableHead>
                                        <TableHead>Recipient(s)</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Est. Delivery</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-[90px] rounded-full" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : orders.length > 0 ? (
                                        orders.map(order => (
                                            <TableRow key={order.orderId} onClick={() => setSelectedOrder(order)} className="cursor-pointer">
                                                <TableCell className="font-medium">{order.orderDate}</TableCell>
                                                <TableCell>
                                                    {order.items.length > 1 
                                                        ? `${order.items.length} people` 
                                                        : order.items[0]?.recipientName ?? 'N/A'
                                                    }
                                                </TableCell>
                                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    {order.status !== 'draft' ? `${order.estimatedDeliveryWindow.start} - ${order.estimatedDeliveryWindow.end}` : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusVariantMap[order.status]}>
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                You haven't sent or saved any cards yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedOrder?.card.headline}</DialogTitle>
                        <DialogDescription>
                           This is the content of the card you {selectedOrder?.status === 'draft' ? 'saved' : 'sent'} on {selectedOrder?.orderDate}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
                        <p className="italic">"{selectedOrder?.card.message}"</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
