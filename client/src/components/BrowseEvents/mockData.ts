import { EventType } from "./types";

// Mock data for testing the search functionality
export const mockEvents: any[] = [
  // Conference Events
  {
    id: "conf-1",
    type: EventType.CONFERENCE,
    name: "AI & Machine Learning Conference 2024",
    description: "Join us for an exciting conference on the latest developments in artificial intelligence and machine learning technologies.",
    agenda: "Day 1: Keynote speeches, Day 2: Technical workshops, Day 3: Panel discussions",
    details: {
      "Registration Deadline": "2024-03-15",
      "Start Date": "2024-04-01",
      "End Date": "2024-04-03",
      "Start Time": "09:00",
      "End Time": "17:00",
      "Extra Required Resources": ["Projector", "Microphones", "Catering"],
      "Funding Source": "University Budget",
      "Required Budget": 50000,
      "Location": "Main Auditorium, Building A",
      "Link": "https://ai-conference-2024.edu"
    }
  },
  {
    id: "conf-2",
    type: EventType.CONFERENCE,
    name: "Sustainable Technology Summit",
    description: "Exploring green technologies and sustainable solutions for the future.",
    agenda: "Environmental tech presentations and networking sessions",
    details: {
      "Registration Deadline": "2024-03-20",
      "Start Date": "2024-04-10",
      "End Date": "2024-04-12",
      "Start Time": "08:30",
      "End Time": "18:00",
      "Extra Required Resources": ["AV Equipment", "Recyclable Materials"],
      "Funding Source": "External Sponsors",
      "Required Budget": 35000,
      "Location": "Green Building, Campus Center",
      "Link": "https://sustainable-tech-summit.edu"
    }
  },

  // Workshop Events
  {
    id: "workshop-1",
    type: EventType.WORKSHOP,
    name: "React Development Workshop",
    description: "Learn modern React development with hooks, context, and best practices.",
    agenda: "Introduction to React, State Management, Component Design, Testing",
    professors: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
    details: {
      "Registration Deadline": "2024-03-10",
      "Start Date": "2024-03-25",
      "End Date": "2024-03-27",
      "Start Time": "10:00",
      "End Time": "16:00",
      "Created By": "Computer Science Department",
      "Faculty Responsible": "Engineering",
      "Extra Required Resources": ["Laptops", "Development Environment Setup"],
      "Funding Source": "Department Budget",
      "Required Budget": 15000,
      "Location": "Computer Lab 3, Engineering Building",
      "Capacity": 30,
      "Spots Left": 12,
      "Status": "Approved"
    }
  },
  {
    id: "workshop-2",
    type: EventType.WORKSHOP,
    name: "Digital Marketing Masterclass",
    description: "Master the art of digital marketing with hands-on experience in social media, SEO, and analytics.",
    agenda: "Social Media Strategy, SEO Optimization, Analytics & Metrics, Campaign Planning",
    professors: ["Dr. Emily Rodriguez", "Prof. David Kim"],
    details: {
      "Registration Deadline": "2024-03-18",
      "Start Date": "2024-04-05",
      "End Date": "2024-04-07",
      "Start Time": "09:00",
      "End Time": "17:00",
      "Created By": "Business School",
      "Faculty Responsible": "Business",
      "Extra Required Resources": ["Marketing Tools Access", "Case Studies"],
      "Funding Source": "Industry Partnership",
      "Required Budget": 25000,
      "Location": "Business School Auditorium",
      "Capacity": 50,
      "Spots Left": 8,
      "Status": "Approved"
    }
  },

  // Bazaar Events
  {
    id: "bazaar-1",
    type: EventType.BAZAAR,
    name: "Spring Arts & Crafts Bazaar",
    description: "Discover unique handmade items, local art, and creative crafts from talented vendors.",
    details: {
      "Registration Deadline": "2024-03-25",
      "Start Date": "2024-04-15",
      "End Date": "2024-04-15",
      "Start Time": "10:00",
      "End Time": "18:00",
      "Time": "10:00 - 18:00",
      "Location": "Student Center Plaza",
      "Vendor Count": 25
    }
  },
  {
    id: "bazaar-2",
    type: EventType.BAZAAR,
    name: "Tech Innovation Fair",
    description: "Showcase of cutting-edge technology products and innovative solutions from tech companies.",
    details: {
      "Registration Deadline": "2024-04-01",
      "Start Date": "2024-04-20",
      "End Date": "2024-04-20",
      "Start Time": "09:00",
      "End Time": "19:00",
      "Time": "09:00 - 19:00",
      "Location": "Technology Hub, Innovation Center",
      "Vendor Count": 40
    }
  },

  // Trip Events
  {
    id: "trip-1",
    type: EventType.TRIP,
    name: "Historical Cairo Tour",
    description: "Explore the rich history of Cairo with visits to ancient mosques, museums, and cultural sites.",
    details: {
      "Registration Deadline": "2024-03-30",
      "Start Date": "2024-04-25",
      "End Date": "2024-04-26",
      "Start Time": "07:00",
      "End Time": "20:00",
      "Location": "Cairo, Egypt",
      "Cost": "500 EGP",
      "Capacity": 25,
      "Spots Left": 5
    }
  },
  {
    id: "trip-2",
    type: EventType.TRIP,
    name: "Alexandria Coastal Adventure",
    description: "Enjoy a relaxing trip to Alexandria with beach activities, historical sites, and local cuisine.",
    details: {
      "Registration Deadline": "2024-04-05",
      "Start Date": "2024-04-30",
      "End Date": "2024-05-01",
      "Start Time": "06:00",
      "End Time": "22:00",
      "Location": "Alexandria, Egypt",
      "Cost": "750 EGP",
      "Capacity": 30,
      "Spots Left": 15
    }
  },

  // Booth Events (Platform Booths)
  {
    id: "booth-1",
    type: EventType.BOOTH,
    company: "Microsoft Egypt",
    people: [
      { name: "Ahmed Hassan", email: "ahmed.hassan@microsoft.com" },
      { name: "Fatima Ali", email: "fatima.ali@microsoft.com" }
    ],
    details: {
      "Setup Duration": 2,
      "Location": "Main Exhibition Hall, Booth A1",
      "Booth Size": "4x4",
      "Description": "Microsoft's latest cloud solutions and development tools showcase"
    }
  },
  {
    id: "booth-2",
    type: EventType.BOOTH,
    company: "Google Cloud",
    people: [
      { name: "Omar Mahmoud", email: "omar.mahmoud@google.com" },
      { name: "Nour Ibrahim", email: "nour.ibrahim@google.com" }
    ],
    details: {
      "Setup Duration": 3,
      "Location": "Technology Pavilion, Booth B2",
      "Booth Size": "4x4",
      "Description": "Google Cloud Platform services and AI/ML solutions demonstration"
    }
  },
  {
    id: "booth-3",
    type: EventType.BOOTH,
    company: "Amazon Web Services",
    people: [
      { name: "Youssef Ahmed", email: "youssef.ahmed@aws.com" }
    ],
    details: {
      "Setup Duration": 2,
      "Location": "Cloud Solutions Area, Booth C1",
      "Booth Size": "2x2",
      "Description": "AWS cloud infrastructure and serverless computing solutions"
    }
  }
];

// Mock user info for testing
export const mockUserInfo = {
  id: "test-user-123",
  name: "Test User",
  email: "test@university.edu"
};
