import emailjs from '@emailjs/browser';

// EmailJS Configuration Keys
const EMAILJS_SERVICE_ID = 'service_8cegnwn';
const EMAILJS_TEMPLATE_ID = 'template_hkpc318';
const EMAILJS_PUBLIC_KEY = 'aroQ7qSy3luWdBGGN';

/**
 * Register User Function
 * -------------------------------------------------------------
 * FOR FRONTEND DEMO: Sends welcome email via EmailJS.
 * FOR BACKEND INTEGRATION: Replace the logic inside with axios/fetch 
 * calling the actual API endpoint (e.g., POST /api/auth/register).
 */
export const registerUser = async (userData) => {
    // --- MODE SWITCH ---
    // Change this to true when backend API is ready!
    const USE_REAL_BACKEND = false; 

    if (USE_REAL_BACKEND) {
        // BACKEND INTEGRATION CODE (Backend team will uncomment this)
        /*
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        return await response.json();
        */
    } else {
        // FRONTEND DEMO CODE (Current implementation)
        try {
            // Send welcome email via EmailJS with keys matching template variables {{name}} & {{email}}
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    name: userData.fullName,
                    email: userData.email,
                },
                EMAILJS_PUBLIC_KEY
            );

            console.log('Frontend Demo: Welcome email sent via EmailJS');
            return { success: true, message: 'Account created & welcome email sent!' };
        } catch (error) {
            console.error('EmailJS Error:', error);
            // Even if email fails during demo, allow registration flow to succeed
            return { success: true, message: 'Account created (email fallback triggered)' };
        }
    }
};