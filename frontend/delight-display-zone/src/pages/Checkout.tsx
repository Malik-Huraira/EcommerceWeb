import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Layout } from '@/components/layout/Layout';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

export default function Checkout() {
  const { state, cartTotal, clearCart } = useStore();
  const { cart, isAuthenticated } = state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: ''
  });

  const shipping = cartTotal > 100 ? 0 : 10;
  const total = cartTotal + shipping;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const fullAddress = `${shippingInfo.firstName} ${shippingInfo.lastName}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}`;
      
      if (isAuthenticated) {
        // Create order via API
        const order = await api.createOrder(fullAddress);
        toast({
          title: "Order placed successfully!",
          description: `Order #${order.id} confirmed. You will receive a confirmation email shortly.`,
        });
      } else {
        // Guest checkout - just simulate
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast({
          title: "Order placed successfully!",
          description: "Thank you for your order. You will receive a confirmation email shortly.",
        });
      }
      
      await clearCart();
      navigate('/');
    } catch (error) {
      toast({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Could not process your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some products to checkout.</p>
          <Link to="/products"><Button>Continue Shopping</Button></Link>
        </div>
      </Layout>
    );
  }


  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft className="w-4 h-4" />Back to Cart
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="flex items-center gap-4 mb-8">
              {[{ num: 1, label: 'Shipping' }, { num: 2, label: 'Payment' }].map((s, index) => (
                <div key={s.num} className="flex items-center gap-4">
                  <button onClick={() => setStep(s.num)} className={`flex items-center gap-2 ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                      {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                    </span>
                    <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
                  </button>
                  {index < 1 && <div className="w-12 h-px bg-border" />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2"><Truck className="w-5 h-5" />Shipping Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="firstName">First Name</Label><Input id="firstName" placeholder="John" value={shippingInfo.firstName} onChange={handleShippingChange} required /></div>
                    <div className="space-y-2"><Label htmlFor="lastName">Last Name</Label><Input id="lastName" placeholder="Doe" value={shippingInfo.lastName} onChange={handleShippingChange} required /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="john@example.com" value={shippingInfo.email} onChange={handleShippingChange} required /></div>
                  <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={shippingInfo.phone} onChange={handleShippingChange} /></div>
                  <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" placeholder="123 Main St" value={shippingInfo.address} onChange={handleShippingChange} required /></div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" placeholder="New York" value={shippingInfo.city} onChange={handleShippingChange} required /></div>
                    <div className="space-y-2"><Label htmlFor="state">State</Label><Input id="state" placeholder="NY" value={shippingInfo.state} onChange={handleShippingChange} required /></div>
                    <div className="space-y-2"><Label htmlFor="zip">ZIP Code</Label><Input id="zip" placeholder="10001" value={shippingInfo.zip} onChange={handleShippingChange} required /></div>
                  </div>
                  <Button type="button" onClick={() => setStep(2)} className="w-full" size="lg">Continue to Payment</Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2"><CreditCard className="w-5 h-5" />Payment Method</h2>
                  <RadioGroup defaultValue="card" className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer"><span className="font-medium">Credit Card</span><p className="text-sm text-muted-foreground">Pay with Visa, Mastercard, or American Express</p></Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer"><span className="font-medium">PayPal</span><p className="text-sm text-muted-foreground">Pay with your PayPal account</p></Label>
                    </div>
                  </RadioGroup>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2"><Label htmlFor="cardNumber">Card Number</Label><Input id="cardNumber" placeholder="4242 4242 4242 4242" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="expiry">Expiry Date</Label><Input id="expiry" placeholder="MM/YY" /></div>
                      <div className="space-y-2"><Label htmlFor="cvc">CVC</Label><Input id="cvc" placeholder="123" /></div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button type="submit" className="flex-1" size="lg" disabled={isProcessing}>{isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}</Button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>


          <div>
            <div className="sticky top-24 p-6 bg-card rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-64 overflow-auto pr-2 scrollbar-thin">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span>Calculated at checkout</span></div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex justify-between items-center"><span className="font-semibold">Total</span><span className="text-xl font-bold">${total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
