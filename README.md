# CodeSingh EdTech Platform

A modern, responsive edtech platform built with React and Tailwind CSS, featuring a beautiful dark/light theme toggle and YouTube-like video player experience.

## ✨ Features

### 🎨 Modern UI/UX
- **Beautiful Design**: Modern, aesthetic interface with smooth animations and transitions
- **Responsive Layout**: Fully responsive design that works on all devices
- **Dark/Light Theme**: Elegant theme toggle with smooth transitions
- **Glass Morphism**: Subtle backdrop blur effects and modern card designs
- **Gradient Accents**: Beautiful gradient buttons and highlights throughout the interface

### 🎥 Video Player Experience
- **YouTube-like Ratios**: Proper 16:9 aspect ratio for video content
- **Responsive Video**: Video player adapts to different screen sizes
- **Video Controls**: Hover overlay with lecture information
- **Full-screen Support**: Native full-screen video playback

### 🚀 Performance & UX
- **Smooth Animations**: CSS transitions and transforms for delightful interactions
- **Loading States**: Beautiful loading spinners and skeleton screens
- **Error Handling**: User-friendly error messages with retry options
- **Navigation**: Intuitive course and lecture navigation
- **Search & Filter**: Easy course discovery and management

### 🎯 Course Management
- **Course Dashboard**: Comprehensive course overview with progress tracking
- **Lecture Navigation**: Easy navigation between lectures with progress indicators
- **Practice Questions**: Integrated practice question system
- **Code Examples**: Syntax-highlighted code snippets with modern styling

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4 with custom design system
- **Icons**: Lucide React for beautiful, consistent icons
- **Routing**: React Router for seamless navigation
- **HTTP Client**: Axios for API communication
- **Code Highlighting**: React Syntax Highlighter for code examples

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd React Frontend/Edtech
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) to Purple (#8B5CF6) gradients
- **Secondary**: Green (#10B981) and Amber (#F59E0B) accents
- **Neutral**: Gray scale with dark mode support
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono for code
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900

### Components
- **Buttons**: Gradient primary buttons with hover effects
- **Cards**: Rounded corners with subtle shadows and borders
- **Inputs**: Modern form inputs with focus states
- **Badges**: Color-coded status indicators
- **Loading**: Animated spinners with custom designs

## 🌙 Theme System

The platform features a sophisticated theme system with:

- **Automatic Detection**: Detects user's system preference
- **Persistent Storage**: Remembers user's theme choice
- **Smooth Transitions**: CSS transitions between themes
- **Consistent Colors**: Proper contrast ratios in both themes
- **Icon Animations**: Smooth icon transitions between themes

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Tailwind's responsive breakpoints
- **Touch Friendly**: Optimized for touch interactions
- **Adaptive Layout**: Sidebar collapses on mobile
- **Flexible Grids**: Responsive course and lecture grids

## 🎯 Key Components

### Header
- Global navigation with theme toggle
- Responsive design with mobile menu
- Sticky positioning for better UX

### Course Cards
- Hover animations and transformations
- Gradient thumbnails with play overlays
- Responsive grid layout

### Video Player
- YouTube-like aspect ratios
- Responsive iframe embedding
- Hover controls overlay

### Sidebar Navigation
- Course overview and progress
- Color-coded navigation items
- Collapsible on mobile devices

## 🔧 Customization

### Adding New Themes
The theme system is easily extensible. Add new themes in `src/contexts/ThemeContext.jsx`:

```jsx
const themes = {
  light: { /* light theme colors */ },
  dark: { /* dark theme colors */ },
  custom: { /* your custom theme */ }
};
```

### Styling Components
Use the utility classes defined in `src/index.css`:

```css
.btn-primary { /* primary button styles */ }
.card { /* card component styles */ }
.glass { /* glass morphism effect */ }
```

## 📊 Performance Features

- **Lazy Loading**: Components load only when needed
- **Optimized Images**: Responsive image handling
- **CSS Animations**: Hardware-accelerated animations
- **Efficient Rendering**: React optimization techniques
- **Bundle Splitting**: Code splitting for better performance

## 🚀 Deployment

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Production
Deploy the `dist` folder to your hosting service of choice.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for beautiful icons
- **React Team** for the amazing framework
- **Vite** for the fast build tool

---

Built with ❤️ by the CodeSingh Team
