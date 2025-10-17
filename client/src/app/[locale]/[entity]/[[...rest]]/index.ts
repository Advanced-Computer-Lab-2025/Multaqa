import { EventType } from "@/components/BrowseEvents/browse-events";
import { Workshop } from "@/components/EventsOffice/WorkshopDetails";

export const demoworkshop: Workshop = {
  id: "demo1",
  type: EventType.WORKSHOP,
  name: 'Advanced Machine Learning Workshop',
  description: 'An intensive 3-day workshop covering advanced machine learning techniques, deep learning frameworks, and practical applications in industry.',
  agenda: `Day 1: Introduction to Deep Learning
- 09:00-10:30: Neural Networks Fundamentals
- 10:45-12:30: Convolutional Neural Networks
- 14:00-17:00: Hands-on Lab Session

Day 2: Advanced Architectures
- 09:00-10:30: Recurrent Neural Networks & LSTMs
- 10:45-12:30: Transformer Models
- 14:00-17:00: Project Work

Day 3: Industry Applications
- 09:00-10:30: Computer Vision Applications
- 10:45-12:30: NLP Applications
- 14:00-17:00: Final Project Presentations`,
  details: {
    "Start Date": '2024-11-15',
    "End Date": '2024-11-17',
    "Start Time": '09:00',
    "End Time": '17:00',
    Location: 'GUC Cairo',
    "Faculty Responsible": 'MET',
    "Professors Participating": 'Dr. Sarah Ahmed, Dr. Mohamed Ali, Prof. John Smith',
    "Required Budget": '50,000 EGP',
    "Funding Source": 'External',
    "Extra Required Resources": 'High-performance computing lab, GPU workstations (10 units), Cloud computing credits',
    Capacity: '30',
    "Registration Deadline": '2024-10-30'
  }
};
// types.ts (or wherever appropriate)