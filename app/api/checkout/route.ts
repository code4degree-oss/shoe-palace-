import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { customer, items } = await req.json();

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured');
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 1. Calculate total from DB prices to prevent tampering
    let total = 0;
    let totalWeightGrams = 0;
    
    const productIds = items.map((item: any) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const orderItemsData = items.map((item: any) => {
      const product = dbProducts.find(p => p.id === item.id);
      if (!product) throw new Error(`Product not found: ${item.id}`);
      
      // Validate stock availability
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
      }

      const priceAtPurchase = product.salePrice || product.price;
      const productShippingWeight = product.shippingWeightGrams || product.weightGrams || 0;
      
      total += priceAtPurchase * item.quantity;
      totalWeightGrams += productShippingWeight * item.quantity;
      
      return {
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase,
        weightGrams: productShippingWeight * item.quantity,
        selectedSize: item.selectedSize || null,
        selectedColor: item.selectedColor || null,
      };
    });

    // 2. Calculate dynamic delivery charge based on state
    let deliveryCharge = 0;
    if (customer.state) {
      const zones = await prisma.deliveryZone.findMany();
      let maharashtra = 50;
      let outside = 80;

      zones.forEach(z => {
        if (z.zone === 'maharashtra') maharashtra = z.charge;
        if (z.zone === 'outside_maharashtra') outside = z.charge;
      });

      if (customer.state.toLowerCase() === 'maharashtra') {
        deliveryCharge = maharashtra;
      } else {
        deliveryCharge = outside;
      }
    }
    
    total += deliveryCharge;

    // 3. Create or Update Customer (safe to do before payment — just saves contact info)
    let dbCustomer = await prisma.customer.findUnique({
      where: { phone: customer.mobile }
    });

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


    if (dbCustomer) {
      dbCustomer = await prisma.customer.update({
        where: { id: dbCustomer.id },
        data: {
          name: customer.name,
          addressLine1: customer.addressLine1,
          addressLine2: customer.addressLine2,
          addressLine3: customer.addressLine3,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
        }
      });
    } else {
      dbCustomer = await prisma.customer.create({
        data: {
          phone: customer.mobile,
          name: customer.name,
          addressLine1: customer.addressLine1,
          addressLine2: customer.addressLine2,
          addressLine3: customer.addressLine3,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
        }
      });
    }

    // 4. Create Razorpay Order ONLY — do NOT create DB order yet
    //    The DB order will be created in /api/checkout/verify AFTER payment succeeds
    const rpOptions = {
      amount: Math.round(total * 100), // in paise
      currency: 'INR',
      receipt: dbCustomer.id, // use customer ID as receipt reference
    };
    
    const rpOrder = await razorpay.orders.create(rpOptions);

    // 5. Return Razorpay details + all data needed to create the order after verification
    return NextResponse.json({
      order_id: rpOrder.id,
      amount: rpOptions.amount,
      currency: rpOptions.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      // Pass order data to frontend so it can send it to verify endpoint
      orderPayload: {
        customerId: dbCustomer.id,
        total,
        deliveryCharge,
        totalWeightGrams,
        orderItemsData,
        shippingName: customer.name,
        shippingPhone: customer.mobile,
        shippingAddress1: customer.addressLine1,
        shippingAddress2: customer.addressLine2 || null,
        shippingCity: customer.city || 'Not Provided',
        shippingState: customer.state || 'Not Provided',
        shippingPincode: customer.pincode,
      }
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during checkout' }, { status: 500 });
  }
}
