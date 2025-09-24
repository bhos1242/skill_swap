# 🌐 Skill Swap Platform

*A modern, community-driven web application enabling people to **exchange skills** through a **barter-based learning model**. Learn what---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- A **Google Cloud Console** account (for OAuth setup)
- A **MongoDB** database (Atlas recommended)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhos1242/skill_swap.git
   cd skill_swap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8888`

### Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/skill_swap"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:8888"

# Google OAuth
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"
```

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:8888/api/auth/callback/google` to authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env.local` file

### Setting Up MongoDB

1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account
2. Create a new cluster
3. Get your connection string
4. Add it to your `.env.local` file as `DATABASE_URL`

---

## 🛠️ Development

### Project Structure

```
skill_swap/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # Page-specific components
│   └── (pages)/          # Application pages
├── components/            # Reusable UI components
├── lib/                  # Utilities and configurations
├── prisma/               # Database schema
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
└── public/               # Static assets
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Contributing Guidelines

We welcome contributions from developers of all skill levels! Here's how you can help:

#### For Beginners
- 🐛 **Bug Fixes**: Fix small bugs and improve error handling
- 📚 **Documentation**: Improve README, add code comments
- 🎨 **UI/UX**: Enhance styling and user experience
- ✅ **Testing**: Add unit tests and integration tests

#### For Intermediate Developers
- ✨ **Features**: Add new functionality and components
- ⚡ **Performance**: Optimize queries and improve loading times
- 🔧 **API Development**: Enhance existing APIs, add new endpoints
- 🔐 **Security**: Improve authentication and data protection

#### For Advanced Developers
- 🚀 **Architecture**: Scalability improvements and performance optimization
- 🔄 **Integrations**: Third-party services and advanced features
- 📊 **Analytics**: User tracking and performance metrics
- 🤖 **AI/ML**: Smart skill matching and recommendation systems

### Contribution Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

Please read our [Contributing Guide](CONTRIBUTING.md) for detailed information.

---

## 📖 Documentation

- [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project
- [Code of Conduct](CODE_OF_CONDUCT.md) - Our community guidelines
- [Security Policy](SECURITY.md) - How to report security vulnerabilities
- [API Documentation](docs/api.md) - API endpoints and usage
- [Database Schema](docs/database.md) - Database structure and relationships

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

---

## 🤝 Contributing

We love contributors! Whether you're a beginner or an expert, there's a place for you here.

### Ways to Contribute

- 🐛 **Report bugs** - Help us identify and fix issues
- 💡 **Suggest features** - Share your ideas for improvements
- 📝 **Improve documentation** - Make it easier for others to contribute
- 🧪 **Write tests** - Help ensure code quality
- 💻 **Submit code** - Fix bugs or add new features

### Getting Help

- 💬 **GitHub Discussions** - Ask questions and share ideas
- 📧 **Email**: help@skillswap.platform
- 📋 **Issues** - Report bugs and request features

### Recognition

All contributors are recognized in our [Contributors](#contributors) section. Outstanding contributors may be invited to join our core team!

---

## 🏆 Contributors

Thank you to all the amazing people who have contributed to this project:

<!-- This section will be automatically updated -->
<a href="https://github.com/bhos1242/skill_swap/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=bhos1242/skill_swap" />
</a>

---

## 📊 Project Status

![GitHub](https://img.shields.io/github/license/bhos1242/skill_swap)
![GitHub issues](https://img.shields.io/github/issues/bhos1242/skill_swap)
![GitHub pull requests](https://img.shields.io/github/issues-pr/bhos1242/skill_swap)
![GitHub stars](https://img.shields.io/github/stars/bhos1242/skill_swap)
![GitHub forks](https://img.shields.io/github/forks/bhos1242/skill_swap)

### Current Version: v0.1.0-beta

- ✅ User authentication with Google OAuth
- ✅ Profile creation and management
- ✅ Skill matching and discovery
- ✅ Basic messaging system
- 🚧 Advanced search and filters
- 🚧 Real-time notifications
- 📋 Review and rating system
- 📋 In-app video calls

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This means you are free to:
- ✅ Use the code commercially
- ✅ Modify and distribute
- ✅ Use in private projects
- ✅ Place warranty

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For the deployment platform
- **Prisma** - For the database toolkit
- **Tailwind CSS** - For the utility-first CSS framework
- **MongoDB** - For the database solution
- **Our Contributors** - For making this project better

---

## 🌍 Community

Join our growing community of learners and skill sharers:

- 🌐 **Website**: [skillswap.platform](https://skillswap.platform)
- 💬 **Discord**: [Join our server](https://discord.gg/skillswap)
- 🐦 **Twitter**: [@SkillSwapApp](https://twitter.com/SkillSwapApp)
- 📧 **Email**: hello@skillswap.platform

---

### 🌐 *Skill Swap: Empowering communities, one exchange at a time.*

**Exchange • Learn • Grow • Connect**

Made with ❤️ by students, for students.ching what you know.*

---

## 🎯 Platform Overview

**Skill Swap Platform** is built with **Next.js** and designed to foster a vibrant skill-sharing ecosystem. Users connect, collaborate, and learn from each other—without monetary transactions—by trading expertise in a structured, trust-driven environment.

---

## 🌟 Purpose

* **Bridge Learners & Teachers**: Connect individuals seeking to learn with those eager to teach.
* **Encourage Skill Sharing**: Empower communities to grow through mutual learning.
* **Foster Trust & Growth**: Strengthen connections and learning relationships through transparent exchanges.
* **Make Learning Accessible**: Remove financial barriers—anyone can grow through knowledge trade.

---

## 🔑 Core Features

### 1. 👤 User Profile Management

* **Basic Details**: Name, profile photo (optional), location (optional)
* **Skills Offered**: List areas of expertise (e.g., Web Development, Yoga, Design)
* **Skills Wanted**: Identify learning interests (e.g., Excel, Photography, Cooking)
* **Availability Settings**: Set preferences (e.g., weekends, evenings)
* **Privacy Options**: Choose to make your profile public or private

---

### 2. 🔍 Discovery & Smart Search

* **Browse Public Profiles**: View skill sets from the community
* **Advanced Filters**: Search by skill, location, or availability
* **Smart Matchmaking**: Get recommendations based on shared interests
* **Reverse Matching**: Find people who want to learn what you can teach

---

### 3. 🤝 Swap Request System

* **Initiate Swaps**: Send detailed proposals for skill exchange
* **Request Tracking**: Monitor statuses—pending, accepted, or completed
* **In-App Chat**: Plan sessions and align expectations
* **Integrated Scheduling**: Coordinate times directly in-app

---

### 4. 🌟 Post-Swap Feedback Loop

* **Ratings**: Evaluate your learning and teaching experience
* **Reviews**: Share feedback to help others choose trusted partners
* **Reputation System**: Build a trusted profile within the community
* **Learning History**: Track completed swaps and skills acquired

---

### 5. 🛡️ Admin Dashboard & Moderation

* **Content Moderation**: Flag and remove spam or inappropriate content
* **User Control**: Ban or warn disruptive users
* **System Announcements**: Share platform updates and new features
* **Community Reports**: Handle disputes and maintain trust
* **Analytics**: Track platform growth, engagement, and performance

---

## 🔄 How It Works: Example in Action

Meet **Sarah** and **Mike**:

**Sarah**

* 🎨 Offers: Photoshop expertise (5+ years experience)
* 📈 Wants: Advanced Excel and Data Analysis
* ⏰ Available: Weekends, 2–3 hrs

**Mike**

* 📊 Offers: Excel (Advanced functions, analysis)
* 🎞 Wants: Photoshop for photography projects
* ⏰ Available: Weekends, flexible

**The Exchange Journey:**

1. **Discovery**: Sarah finds Mike via search
2. **Swap Request**: She proposes an exchange: Photoshop for Excel
3. **Agreement**: Mike accepts, and they align on timing
4. **Sessions** (4 over 2 months):

   * Photoshop basics ↔ Excel fundamentals
   * Advanced tools and workflows ↔ Formulas, Pivot Tables
   * Creative Projects ↔ Automation techniques
5. **Feedback**: They rate and review each other
6. **Growth**: Their experience builds credibility and inspires others

---

## 🚀 Get Started

### 🔧 Prerequisites

* Node.js 18+
* Preferred package manager: npm, yarn, pnpm, or bun

### 📦 Installation

```bash
git clone <repository-url>
cd skill_swap
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Start development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open in browser:
[http://localhost:3000](http://localhost:3000)

---

### ⚙️ Development Commands

* `npm run dev` – Launch dev server with Turbopack
* `npm run build` – Build production-ready app
* `npm run start` – Run production server
* `npm run lint` – Run ESLint checks

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15.3.5
* **Frontend**: React 19
* **Styling**: Tailwind CSS 4
* **Language**: TypeScript 5
* **Quality**: ESLint integration
* **Bundler**: Turbopack

---

## 🤝 Contributing

We love contributors!
Whether it’s feature requests, bug fixes, or new ideas—your input helps make Skill Swap better. Please submit PRs or open issues.

---

## 📄 License

This project is **private and proprietary**. Not for commercial redistribution.

---

### 🌐 *Skill Swap: Empowering communities, one exchange at a time.*

**Exchange • Learn • Grow**

