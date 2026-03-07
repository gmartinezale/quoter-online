# QUOTER ONLINE

A Next.js 16 project with Tailwind CSS, ESLint, TypeScript and Mongoose for APIs.
Add your products with categories and export your quotations.

## Prerequisites

- [NodeJS >= 20.x](https://nodejs.org/) (Next.js 16 requires Node 20+)
- [pnpm >= 9.0.0](https://pnpm.io/installation) (recommended package manager)
- [MongoDB](https://www.mongodb.com/try/download/community) server

## Installation

### 1. Install pnpm (if you don't have it)

```bash
# macOS/Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Or using npm
npm install -g pnpm@9
```

### 2. Set up the project

1. Clone the repository.
2. Run `pnpm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in your values.
4. Configure the connection in the seed script at `scripts/seed.js`.
5. Run the seed script with `pnpm seed`.
6. Run `pnpm dev` to start the development server.

## Available Scripts

```bash
pnpm dev         # Start the development server
pnpm build       # Build the application for production
pnpm start       # Start the production server
pnpm lint        # Run the linter
pnpm prettier    # Format the code
pnpm seed        # Run the data seed script
```

## Usage

Visit `http://localhost:3000` in your browser to see the application.

## Main Technologies

- **Next.js 16** - React framework with React Compiler enabled
- **React 19** - UI library
- **TypeScript 5** - Typed superset of JavaScript
- **Tailwind CSS 3** - Utility-first CSS framework
- **Mongoose 8** - MongoDB ODM
- **NextAuth.js 5** - Authentication
- **pnpm 9** - Fast and efficient package manager

## Icons
This project uses [Heroicons](https://heroicons.com/)

## Next.js 16 Features

This project takes advantage of the following Next.js 16 features:
- **React Compiler**: Automatic performance optimizations
- **Turbopack**: Ultra-fast build tool for development

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)