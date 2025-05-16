# Frontend Interview Questions (Viva)

## React Fundamentals

1. **What is React and why do we use it?**
- React is a JavaScript library for building user interfaces
- Key benefits: Virtual DOM, component-based architecture, and unidirectional data flow

2. **What is JSX?**
- JSX is a syntax extension for JavaScript that allows writing HTML-like code in React
- Gets compiled to regular JavaScript using Babel

3. **What are React Hooks?**
- Functions that allow using state and lifecycle features in functional components
- Common hooks: useState, useEffect, useContext, useRef

4. **Explain Virtual DOM**
- In-memory representation of actual DOM
- React compares Virtual DOM with real DOM to minimize actual DOM updates
- Results in better performance

## Project Specific

5. **What is the purpose of AuthContext in this application?**
- Manages authentication state globally
- Provides user login/logout functionality
- Shares user data across components

6. **How is routing handled in the application?**
- Uses React Router for client-side routing
- Protected routes for authenticated users
- Public routes for login/register

7. **What is Tailwind CSS and why use it?**
- Utility-first CSS framework
- Provides pre-built classes for rapid styling
- Highly customizable through configuration

## Component Architecture

8. **What are controlled components?**
- Form inputs whose values are controlled by React state
- Example: LoginForm.tsx uses controlled inputs for username/password

9. **What is prop drilling and how to avoid it?**
- Passing props through multiple levels of components
- Solution: Use Context API (like JobContext in this project) or state management libraries

10. **What are custom hooks?**
- Reusable logic extracted into separate functions
- Example: useJobs hook manages job-related state and API calls

## State Management

11. **How is state managed in the application?**
- Local state: useState for component-level state
- Global state: Context API for auth and jobs
- Props for component communication

12. **What is the Context API?**
- Built-in state management solution
- Avoids prop drilling
- Used for auth and job state management

## Performance

13. **How to optimize React performance?**
- Use React.memo for component memoization
- Implement useCallback for function memoization
- Use useMemo for expensive computations

14. **What is code splitting?**
- Splitting code into smaller chunks
- Lazy loading components
- Improves initial load time

## TypeScript Integration

15. **Why use TypeScript with React?**
- Type safety during development
- Better IDE support
- Clearer component interfaces

16. **What are interfaces in TypeScript?**
- Define shape of objects
- Example: job.ts defines interfaces for job-related data

## Testing

17. **How to test React components?**
- Unit tests using Jest
- Component testing with React Testing Library
- Integration tests for user flows

## API Integration

18. **How are API calls handled?**
- Services folder contains API logic
- Axios for making HTTP requests
- Custom hooks for data fetching

## Styling Solutions

19. **What styling approaches are used?**
- Tailwind CSS for utility classes
- CSS modules for component-specific styles
- UI components for consistent design

## Error Handling

20. **How is error handling implemented?**
- Try-catch blocks in async operations
- Error boundaries for component errors
- User-friendly error messages

## Build and Deployment

21. **What build tools are used?**
- Vite for development and building
- TypeScript for type checking
- ESLint for code quality