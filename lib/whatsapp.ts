// ─── WhatsApp Cloud API Integration ────────────────────────
// Sends one-way template messages via the Meta WhatsApp Cloud API.
// Requires 3 env variables:
//   WHATSAPP_ACCESS_TOKEN
//   WHATSAPP_PHONE_NUMBER_ID
//   WHATSAPP_BUSINESS_ACCOUNT_ID (optional, kept for reference)

const WHATSAPP_API_VERSION = 'v21.0';

function getConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    return null; // WhatsApp not configured — skip silently
  }

  return { accessToken, phoneNumberId };
}

/**
 * Format an Indian phone number to WhatsApp format (91XXXXXXXXXX).
 * Handles: +91..., 91..., 0..., or raw 10-digit numbers.
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // If it starts with 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // If it's 10 digits, prepend 91
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }

  // If it starts with 91 and is 12 digits, it's correct
  return cleaned;
}

/**
 * Send a WhatsApp template message.
 * Returns true if sent successfully, false otherwise.
 * Never throws — failures are logged silently so they don't break the main flow.
 */
async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  components: any[]
): Promise<boolean> {
  const config = getConfig();
  if (!config) {
    console.log('[WhatsApp] Not configured — skipping message.');
    return false;
  }

  const formattedPhone = formatPhoneNumber(to);
  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${config.phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: formattedPhone,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[WhatsApp] API Error:', JSON.stringify(data));
      return false;
    }

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


    console.log(`[WhatsApp] Message sent to ${formattedPhone} (template: ${templateName})`);
    return true;
  } catch (error) {
    console.error('[WhatsApp] Network Error:', error);
    return false;
  }
}

// ─── Public Functions ──────────────────────────────────────

/**
 * Send order confirmation message after successful purchase.
 * Template name: "order_confirmation"
 * Expected template parameters:
 *   {{1}} = Customer Name
 *   {{2}} = Order Number
 *   {{3}} = Total Amount (₹)
 */
export async function sendOrderConfirmation(
  phone: string,
  customerName: string,
  orderNumber: string,
  totalAmount: number
): Promise<boolean> {
  return sendTemplateMessage(phone, 'order_confirmation', 'en', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: customerName },
        { type: 'text', text: orderNumber },
        { type: 'text', text: `₹${totalAmount}` },
      ],
    },
  ]);
}

/**
 * Send shipping notification when order status is changed to SHIPPED.
 * Template name: "order_shipped"
 * Expected template parameters:
 *   {{1}} = Customer Name
 *   {{2}} = Order Number
 */
export async function sendShippingNotification(
  phone: string,
  customerName: string,
  orderNumber: string
): Promise<boolean> {
  return sendTemplateMessage(phone, 'order_shipped', 'en', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: customerName },
        { type: 'text', text: orderNumber },
      ],
    },
  ]);
}

/**
 * Send delivery confirmation when order status is changed to DELIVERED.
 * Template name: "order_delivered"
 * Expected template parameters:
 *   {{1}} = Customer Name
 *   {{2}} = Order Number
 */
export async function sendDeliveryConfirmation(
  phone: string,
  customerName: string,
  orderNumber: string
): Promise<boolean> {
  return sendTemplateMessage(phone, 'order_delivered', 'en', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: customerName },
        { type: 'text', text: orderNumber },
      ],
    },
  ]);
}
