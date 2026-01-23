
import { useEffect, useRef } from 'react';

interface RazorpayButtonProps {
    paymentButtonId: string;
}

export const RazorpayButton = ({ paymentButtonId }: RazorpayButtonProps) => {
    const containerRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous content to avoid duplicates on re-renders
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
        script.dataset.payment_button_id = paymentButtonId;
        script.async = true;

        containerRef.current.appendChild(script);
    }, [paymentButtonId]);

    return <form ref={containerRef} className="w-full flex justify-center" />;
};
