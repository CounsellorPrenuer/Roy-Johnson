
import type { CoachingPackage } from "@shared/schema";

// Extending the interface to include paymentButtonId since we're using mock data locally
// and don't want to change the database schema for this temporary static conversion
interface ExtendedCoachingPackage extends CoachingPackage {
  paymentButtonId: string;
}

export const MOCK_PACKAGES: ExtendedCoachingPackage[] = [
  // Freshers Category
  {
    id: "pkg_1",
    name: "Discover",
    category: "freshers",
    packageType: "discover",
    price: "5500.00",
    features: ["Resume Review", "LinkedIn Optimization", "Job Search Strategy", "1 Mock Interview"],
    isActive: true,
    createdAt: new Date(),
    paymentButtonId: "pl_RwDuOx96VYrsyN"
  },
  {
    id: "pkg_2",
    name: "Discovery Plus",
    category: "freshers",
    packageType: "discovery_plus",
    price: "15000.00",
    features: ["Resume Review", "LinkedIn Optimization", "Job Search Strategy", "3 Mock Interviews", "Email Support"],
    isActive: true,
    createdAt: new Date(),
    paymentButtonId: "pl_RwDq8XpK76OhB3"
  },

  // Middle Management Category
  {
    id: "pkg_3",
    name: "Achieve",
    category: "middle-management",
    packageType: "achieve",
    price: "5999.00",
    features: ["Career Roadmap", "Resume & LinkedIn Overhaul", "Networking Strategy", "1 Leadership Coaching Session"],
    isActive: true,
    createdAt: new Date(),
    paymentButtonId: "pl_RwDxvLPQP7j4rG"
  },
  {
    id: "pkg_4",
    name: "Achieve Plus",
    category: "middle-management",
    packageType: "achieve_plus",
    price: "10599.00",
    features: ["Career Roadmap", "Resume & LinkedIn Overhaul", "Networking Strategy", "3 Leadership Coaching Sessions", "Priority Support"],
    isActive: true,
    createdAt: new Date(),
    paymentButtonId: "pl_RwDzfVkQYEdAIf"
  },

  // Senior Professionals Category
  {
    id: "pkg_5",
    name: "Ascend",
    category: "senior-professionals",
    packageType: "ascend",
    price: "19999.00", // Est. based on previous data
    features: ["Executive Presence", "Board Bio Creation", "Strategic Networking", "1 Executive Coaching Session"],
    isActive: true,
    createdAt: new Date(),
    paymentButtonId: "pl_RwE1evNHrHWJDW"
  },
  {
    id: "pkg_6",
    name: "Ascend Plus",
    category: "senior-professionals",
    packageType: "ascend_plus",
    price: "29999.00", // Est. based on previous data
    features: ["Executive Presence", "Board Bio Creation", "Strategic Networking", "3 Executive Coaching Sessions", "VIP Support"],
    isActive: true,
    createdAt: new Date(),
    paymentButtonId: "pl_RwE3WEILWB9WeJ"
  }
];
