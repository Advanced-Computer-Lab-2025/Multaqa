import React from 'react';
import { Mail, Users } from 'lucide-react';
import EmptyState from '@/components/shared/states/EmptyState';

// Type definition
interface Attendee {
  email: string;
  firstName: string;
  lastName: string;
  _id: string;
}

interface AttendeesListProps {
  attendees: Attendee[];
}

export const AttendeesList: React.FC<AttendeesListProps> = ({ attendees }) => {
  // Helper function to get initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper function to generate consistent colors based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', 
      '#f57c00', '#0097a7', '#c2185b', '#5d4037'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  console.log(attendees);

  return (
    <div className="w-full bg-white rounded-lg">
       { attendees && attendees?.length>0 && <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Attendees</h2>
        <p className="text-sm text-gray-500 mt-1">
          {attendees?.length} {attendees?.length === 1 ? 'person' : 'people'} attending
        </p>
      </div>
      }
      {/* List */}
      {attendees && attendees?.length>0 && <div className="divide-y divide-gray-100">
        {attendees?.map((attendee) => (
          <div
            key={attendee._id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-base flex-shrink-0"
                style={{ backgroundColor: getAvatarColor(attendee.firstName) }}
              >
                {getInitials(attendee.firstName, attendee.lastName)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  {attendee.firstName} {attendee.lastName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{attendee.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      }

      {/* Empty State */}
      {!attendees || attendees?.length === 0 && (
      <EmptyState  
      title = "No Attendees Yet"
      description = "Try comming back later to see your attendees!"/>
      )}
    </div>
  );
};

// Demo component with sample data
export default function App() {
  const sampleAttendees: Attendee[] = [
    {
      email: "omar.mohammed@guc.edu.eg",
      firstName: "Omar",
      lastName: "Mohammed",
      _id: "68e8f60bcf1172a5cbc4edd5"
    },
    {
      email: "sarah.ahmed@guc.edu.eg",
      firstName: "Sarah",
      lastName: "Ahmed",
      _id: "68e8f60bcf1172a5cbc4edd6"
    },
    {
      email: "john.doe@guc.edu.eg",
      firstName: "John",
      lastName: "Doe",
      _id: "68e8f60bcf1172a5cbc4edd7"
    },
    {
      email: "emma.wilson@guc.edu.eg",
      firstName: "Emma",
      lastName: "Wilson",
      _id: "68e8f60bcf1172a5cbc4edd8"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full shadow-lg rounded-lg overflow-hidden">
        <AttendeesList attendees={sampleAttendees} />
      </div>
    </div>
  );
}