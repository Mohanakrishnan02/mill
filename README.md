# Jayalakshmi Vilas Rice Mill

E-commerce website for **Jayalakshmi Vilas Rice Mill**, Melur, Madurai — traditional rice varieties, cart, distance-based delivery, and Razorpay checkout.

**Live site:** [mill-mauve.vercel.app](https://mill-mauve.vercel.app)

## Stack

- Next.js 15, TypeScript, Tailwind CSS v4
- Razorpay payments
- Cart with localStorage + save-for-later

## Local development

```bash
npm install
cp .env.local.example .env.local   # add Razorpay keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Connected to [Vercel](https://vercel.com). Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in project environment variables for live payments.
