# Nirogya Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- An OpenAI account with API access ([platform.openai.com](https://platform.openai.com))

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd healthcare-app
npm install --legacy-peer-deps
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your project dashboard
3. Copy and run the entire `supabase-setup.sql` script
4. Verify the following were created:
   - Tables: `profiles`, `files`, `report_summaries`
   - Storage bucket: `uploads`
   - RLS policies enabled

### 4. Get Your API Keys

#### Supabase Keys
1. Go to your Supabase project **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

#### OpenAI API Key
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy and save it securely (you won't see it again!)

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_key_here
```

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the AI Analysis

1. **Sign up** for a new account
2. Go to **Upload** page
3. Upload a medical report image (JPG, PNG, etc.)
4. Go to **Dashboard**
5. Click the **Analyze** button on your uploaded file
6. Wait for the AI to process (usually 5-15 seconds)
7. View the comprehensive summary!

## Troubleshooting

### "OpenAI API key not configured"
- Make sure `OPENAI_API_KEY` is set in `.env.local`
- Restart your dev server after adding the key

### "Supabase environment variables are not configured"
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify the values are correct (no extra spaces)

### Analysis fails with "File not found in storage"
- Ensure the file uploaded successfully first
- Check Supabase Storage bucket permissions
- Verify RLS policies are set up correctly

### "Failed to process report"
- Check your OpenAI API key is valid and has credits
- Ensure the uploaded file is a supported image format
- Check browser console and server logs for detailed errors

## Production Deployment (Vercel)

1. Push your code to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
4. Deploy!

## Cost Considerations

### OpenAI GPT-4o Pricing (as of 2024)
- **Input**: ~$2.50 per 1M tokens
- **Output**: ~$10 per 1M tokens
- **Images**: Charged based on detail level (high detail uses more tokens)

**Estimated cost per medical report analysis**: $0.02 - $0.10

### Supabase Pricing
- **Free tier**: 500MB database, 1GB storage, 2GB bandwidth
- **Pro tier**: $25/month for more resources

## Security Best Practices

1. **Never commit** `.env.local` to git
2. **Rotate keys** regularly, especially if exposed
3. **Use service role key** only on server-side (API routes)
4. **Enable RLS** on all Supabase tables
5. **Monitor usage** to prevent unexpected costs

## Support

For issues or questions:
- Check the main [README.md](./README.md)
- Review Supabase documentation
- Check OpenAI API status page
- Open an issue on GitHub
