# Career Plans Website Design Guidelines

## Design Approach: Reference-Based Premium Business
**Inspiration:** Premium consulting websites (Leadcrest-style) with modern glassmorphism and professional coaching aesthetics. Focus on trust-building, expertise demonstration, and conversion optimization.

## Core Design Principles
- **Premium Professional:** Convey expertise and trustworthiness through sophisticated design
- **Conversion-Focused:** Every element should guide users toward booking consultations or purchasing plans
- **Accessible Authority:** Approachable yet authoritative visual hierarchy
- **Modern Sophistication:** Contemporary design elements that feel cutting-edge but not trendy

## Color Palette

### Primary Colors
- **Dark Teal:** #003752 (48 100% 16%) - Headlines, primary UI elements, dark backgrounds
- **Aqua:** #408FA4 (194 44% 45%) - Accent colors, buttons, highlights
- **Background:** #F8F9FA (210 25% 98%) - Clean off-white base

### Gradients
- **Primary Gradient:** Dark Teal to Aqua for hero backgrounds, buttons, and premium elements
- **Subtle Accents:** Light aqua to white for card backgrounds and overlays
- **Dark Gradients:** Dark teal variations for admin dashboard and footer sections

## Typography
- **Headings:** Lexend (bold, impactful) - 600-700 weight
- **Body Text:** Inter (highly readable) - 400-500 weight  
- **Scale:** Use Tailwind's type scale (text-sm to text-6xl) with generous line heights for readability

## Layout System
**Spacing Primitives:** Tailwind units of 4, 8, 12, 16, 24 (p-4, m-8, gap-12, etc.)
- **Containers:** max-w-7xl with px-4 for mobile, px-8 for desktop
- **Sections:** py-16 on desktop, py-12 on mobile for consistent vertical rhythm
- **Cards:** p-6 to p-8 with rounded-xl for premium feel

## Component Library

### Navigation
- **Sticky glassmorphism navbar** with backdrop-blur-md
- **Logo positioning:** Left-aligned with proper spacing
- **CTA button:** Gradient background with hover scale effect

### Hero Section
- **Full viewport height** with gradient background overlay
- **Abstract shapes:** Subtle geometric elements in brand colors
- **Dual CTAs:** Primary (gradient-filled) and secondary (outline with blur background)
- **Trust indicators:** Statistics cards with glassmorphism effect

### Cards & Content Blocks
- **Service cards:** hover:scale-105 with shadow-xl and glassmorphism backing
- **Pricing cards:** Differentiated with gradient borders for premium plans
- **Testimonial cards:** Clean layout with profile images and rating displays
- **Blog cards:** Image-first with overlay text and category tags

### Interactive Elements
- **Buttons:** Gradient backgrounds with subtle hover animations
- **Forms:** Focused states with aqua accent colors
- **Modals:** Backdrop blur with centered content and smooth transitions

### Admin Dashboard
- **Dark theme:** Using dark teal as primary background
- **Data visualization:** Clean charts with brand color accents
- **CRUD interfaces:** Card-based layouts with clear action buttons

## Animations & Effects
- **Scroll animations:** Fade-in and slide-up on reveal (use sparingly)
- **Hover effects:** Scale (1.05), color transitions, shadow enhancements
- **Glassmorphism:** backdrop-blur-md with subtle transparency for overlays
- **Smooth scrolling:** Between sections with offset for sticky navbar

## Accessibility Features
- **Color contrast:** Ensure WCAG AA compliance with dark teal on light backgrounds
- **Focus states:** Clear outline styles using aqua color
- **Alt text:** Descriptive text for all images including logo and profile
- **Keyboard navigation:** Logical tab order throughout interface

## Images Section
- **Hero Background:** Abstract gradient with geometric shapes, no large hero image needed
- **Logo:** Provided brand logo in navbar and footer
- **Profile Photo:** Roy Johnson's headshot in About section, rounded frame with subtle shadow
- **Service Icons:** Use Heroicons or similar icon library for service cards
- **Placeholder Images:** For blog posts and testimonials, use professional stock photos
- **Background Patterns:** Subtle geometric patterns in section dividers using brand colors

## Responsive Behavior
- **Mobile-first approach:** Stack cards vertically, collapse navigation to hamburger
- **Tablet optimization:** 2-column layouts where appropriate
- **Desktop enhancement:** Full grid layouts with generous whitespace