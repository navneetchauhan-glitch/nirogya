# NIROGYA - AI-Powered Medical Document Management

A secure medical document management application with AI-powered report analysis, built with Next.js, Supabase, and OpenAI GPT-4o vision technology.

## Features

✅ **User Authentication**
- Sign up and login with email/password
- Secure session management
- Protected routes

✅ **File Management**
- Upload medical documents (PDF, images)
- Organize files by categories
- Download and share files
- Delete files securely

✅ **AI-Powered Report Analysis** 🧠
- **GPT-4o Vision Analysis** - Directly analyzes medical report images using OpenAI's GPT-4o vision model
- **Intelligent Summarization** - Generates comprehensive, human-readable summaries in layman terms
- **Manual Analysis Trigger** - Click "Analyze" button to process uploaded reports
- **Real-time Processing** - Shows processing status with live updates
- **Smart Status Tracking** - Visual indicators for pending, processing, completed, and failed states

✅ **Dashboard**
- View all uploaded documents with AI summaries
- Search and filter files
- Grid and list view options
- File statistics and processing status

✅ **Security**
- Row Level Security (RLS) in Supabase
- User-specific file access
- Encrypted file storage

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: OpenAI GPT-4o (Vision API)
- **UI Components**: Radix UI, Lucide React icons

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd healthcare-app
npm install --legacy-peer-deps
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Navigate to **SQL Editor**
4. Run the SQL script from `supabase-setup.sql` to create tables and policies
5. Go to **Storage** and verify the `uploads` bucket was created

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Optional but recommended for server-side operations

# OpenAI Configuration (Required for AI analysis)
OPENAI_API_KEY=your_openai_api_key
```

**Where to find these values:**
- Supabase values: Your Supabase project settings under **API**
- OpenAI API Key: Get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

### Tables

**profiles**
- `id` (UUID, Primary Key) - References auth.users
- `email` (TEXT) - User email
- `full_name` (TEXT) - User's full name
- `created_at` (TIMESTAMP) - Profile creation time

**files**
- `id` (UUID, Primary Key) - File identifier
- `user_id` (UUID) - References auth.users
- `file_name` (TEXT) - Original filename
- `file_url` (TEXT) - Storage path
- `file_type` (TEXT) - MIME type
- `file_size` (BIGINT) - File size in bytes
- `uploaded_at` (TIMESTAMP) - Upload time

### Storage

- **Bucket**: `uploads`
- **Structure**: `{user_id}/{timestamp}-{filename}`
- **Access**: Private, user-specific

## Security Features

- **Row Level Security (RLS)**: Users can only access their own files
- **Storage Policies**: Files are stored in user-specific folders
- **Authentication**: Supabase Auth handles secure authentication
- **Data Validation**: File type and size validation

## AI-Powered Analysis Process

### How It Works

1. **File Upload**: User uploads a medical document (image)
2. **Manual Analysis**: User clicks "Analyze" button on dashboard
3. **Vision Analysis**: Image is sent directly to OpenAI's GPT-4o vision model
4. **AI Processing**: GPT-4o analyzes the medical report image and extracts key information
5. **Summarization**: AI generates a comprehensive, human-readable summary
6. **Storage**: Summary is stored in `report_summaries` table with processing status
7. **Display**: Dashboard shows real-time processing status and final summary

### Supported File Types

- **Images**: JPG, PNG, GIF, BMP, TIFF (Direct vision analysis)
- **PDFs**: Currently not supported for AI analysis (coming soon)

### AI Model Used

- **OpenAI Model**: `gpt-4o` (GPT-4 with vision capabilities)
- **Purpose**: Direct medical report image analysis and intelligent summarization
- **Features**: 
  - High-detail image analysis
  - Extraction of key health metrics
  - Identification of normal vs abnormal findings
  - Clear explanations in layman's terms
- **Output**: Comprehensive, friendly summaries optimized for non-medical users

## File Upload Process

1. User selects files via drag & drop or file picker
2. Files are validated (type, size)
3. Files are uploaded to Supabase Storage in user-specific folders
4. File metadata is stored in the database
5. User can view, download, or delete their files

## Development

### Project Structure

```
app/
├── login/           # Login page
├── signup/          # Signup page
├── dashboard/       # Main dashboard
├── upload/          # File upload page
└── layout.tsx       # Root layout with AuthProvider

components/
├── auth-guard.tsx   # Route protection component
└── ui/              # Reusable UI components

lib/
├── supabase.ts      # Supabase client configuration
└── auth-context.tsx # Authentication context
```

### Key Components

- **AuthProvider**: Manages authentication state
- **AuthGuard**: Protects routes requiring authentication
- **Dashboard**: Displays user files with CRUD operations
- **Upload**: Handles file uploads to Supabase Storage

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)
- `OPENAI_API_KEY` - Your OpenAI API key (required for AI analysis)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.
