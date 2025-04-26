# Personal Finance Visualizer

A modern web application for tracking personal finances, managing budgets, and visualizing spending patterns. Built with Next.js and featuring a clean, responsive design.

![Personal Finance Visualizer](https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

### Transaction Management
- Add, edit, and delete financial transactions
- Track expenses and income
- Categorize transactions
- Filter transactions by date and category

### Budget Tracking
- Set monthly budgets for different categories
- Visual budget vs. actual spending comparison
- Track budget progress with intuitive progress bars
- Get instant feedback on overspending

### Data Visualization
- Monthly expenses overview
- Category-wise spending breakdown
- Budget comparison charts
- Interactive charts and graphs

### User Interface
- Clean and modern design
- Responsive layout for all devices
- Dark mode support
- Intuitive navigation

## Technology Stack

- **Framework**: Next.js 13 with React 18
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Data Persistence**: Local Storage
- **Icons**: Lucide React

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── budgets/         # Budget management page
│   ├── categories/      # Categories management page
│   ├── transactions/    # Transactions page
│   └── layout.tsx       # Root layout component
├── components/          # React components
│   ├── budgets/        # Budget-related components
│   ├── categories/     # Category-related components
│   ├── charts/         # Chart components
│   ├── transactions/   # Transaction components
│   └── ui/             # UI components
├── lib/                # Utilities and store
│   ├── store.ts       # Zustand store
│   └── utils.ts       # Helper functions
└── public/            # Static assets
```

## Key Features Explained

### Transaction Management
- Easy-to-use form for adding transactions
- Support for both expenses and income
- Date selection with calendar
- Category assignment
- Filtering and sorting capabilities

### Budgeting System
- Set monthly budgets per category
- Visual progress tracking
- Overspending alerts
- Budget vs. actual comparison

### Dashboard
- Overview of financial status
- Recent transactions
- Monthly spending trends
- Category-wise breakdown

## Local Storage

The application uses browser's local storage for data persistence:
- Transactions and categories are stored locally
- Data persists across page refreshes
- No backend required
- Instant operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the charting library
- [Zustand](https://github.com/pmndrs/zustand) for state management