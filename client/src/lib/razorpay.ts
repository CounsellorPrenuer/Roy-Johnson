// Razorpay integration utilities
import { apiRequest } from './queryClient';

export interface RazorpayOrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  paymentId: string;
  packageDetails: {
    id: string;
    name: string;
    price: string;
    category: string;
  };
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  paymentId: string;
  packageId: string;
  userId: string;
}

// Create Razorpay order
export const createRazorpayOrder = async (packageId: string, userId: string): Promise<RazorpayOrderResponse> => {
  const response = await apiRequest('POST', '/api/payments/create-order', {
    packageId,
    userId
  });
  return response.json();
};

// Verify payment after successful Razorpay transaction
export const verifyPayment = async (data: PaymentVerificationData) => {
  const response = await apiRequest('POST', '/api/payments/verify', data);
  return response.json();
};

// Get Razorpay public key
export const getRazorpayKey = async (): Promise<string> => {
  const response = await apiRequest('GET', '/api/payments/razorpay-key');
  const data = await response.json();
  return data.key;
};

// Initialize Razorpay payment
export const initializePayment = async (
  packageId: string, 
  userId: string,
  userDetails: {
    name: string;
    email: string;
    phone?: string;
  },
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) => {
  try {
    // Get Razorpay key
    const razorpayKey = await getRazorpayKey();
    
    // Create order
    const orderData = await createRazorpayOrder(packageId, userId);
    
    // Configure Razorpay options
    const options = {
      key: razorpayKey,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Career Plans",
      description: `Payment for ${orderData.packageDetails.name} package`,
      order_id: orderData.orderId,
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone || "",
      },
      theme: {
        color: "#003752", // Brand teal color
      },
      handler: async function (response: any) {
        try {
          // Verify payment on backend
          const verificationData: PaymentVerificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentId: orderData.paymentId,
            packageId: packageId,
            userId: userId
          };
          
          const verificationResult = await verifyPayment(verificationData);
          onSuccess(verificationResult);
        } catch (error) {
          console.error('Payment verification failed:', error);
          onError(error);
        }
      },
      modal: {
        ondismiss: function() {
          onError(new Error('Payment cancelled by user'));
        }
      }
    };

    // Load Razorpay script and open payment modal
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      throw new Error('Razorpay SDK not loaded');
    }
  } catch (error) {
    console.error('Payment initialization failed:', error);
    onError(error);
  }
};

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};