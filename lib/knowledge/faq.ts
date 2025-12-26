export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const faqData: FAQItem[] = [
  {
    category: 'Shipping',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Same-day delivery is available for orders placed before 2 PM in select metro areas.',
  },
  {
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to over 50 countries. International shipping typically takes 10-14 business days. Import duties and taxes may apply depending on your location.',
  },
  {
    category: 'Shipping',
    question: 'How much does shipping cost?',
    answer: 'Standard shipping is free for orders over $50. Express shipping costs $9.99. International shipping rates vary by destination, starting at $14.99.',
  },
  {
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Items must be unused and in original packaging. Electronics have a 15-day return window. To initiate a return, visit your order history and select "Return Item".',
  },
  {
    category: 'Returns',
    question: 'How do I return an item?',
    answer: 'Go to My Orders, select the item you want to return, click "Return Item", choose a reason, and print your prepaid shipping label. Drop off the package at any authorized shipping location.',
  },
  {
    category: 'Returns',
    question: 'How long do refunds take?',
    answer: 'Once we receive your return, refunds are processed within 3-5 business days. The refund will appear on your original payment method within 5-10 business days depending on your bank.',
  },
  {
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, Google Pay, and Shop Pay. We also offer financing options through Affirm for orders over $50.',
  },
  {
    category: 'Payment',
    question: 'Is my payment information secure?',
    answer: 'Yes, we use industry-standard SSL encryption and are PCI DSS compliant. We never store your full credit card number on our servers.',
  },
  {
    category: 'Orders',
    question: 'How can I track my order?',
    answer: 'Once your order ships, you will receive a tracking email. You can also view tracking information in the My Orders section of your account. Click on the order number to see detailed tracking.',
  },
  {
    category: 'Orders',
    question: 'Can I cancel my order?',
    answer: 'Orders can be cancelled within 1 hour of placement. After that, the order enters processing and cannot be cancelled. You can refuse delivery or return the item after receiving it.',
  },
  {
    category: 'Orders',
    question: 'Can I modify my order after placing it?',
    answer: 'Order modifications (address, items) can only be made within 30 minutes of placing the order. Contact customer support immediately if you need to make changes.',
  },
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions in the reset email. The link expires after 24 hours.',
  },
  {
    category: 'Warranty',
    question: 'What warranty do your products have?',
    answer: 'Electronics come with a 1-year manufacturer warranty. Extended warranties (2 or 3 years) are available for purchase. Home goods have a 90-day warranty against defects.',
  },
  {
    category: 'Warranty',
    question: 'How do I make a warranty claim?',
    answer: 'Contact customer support with your order number and description of the issue. We will guide you through the warranty claim process, which typically takes 5-7 business days.',
  },
];

export function getFAQContext(): string {
  const grouped = faqData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  let context = '';
  for (const [category, items] of Object.entries(grouped)) {
    context += `\n### ${category}\n`;
    for (const item of items) {
      context += `Q: ${item.question}\nA: ${item.answer}\n\n`;
    }
  }

  return context.trim();
}
