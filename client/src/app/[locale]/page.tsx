"use client";
import { useState } from "react";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import DeleteButton from "@/components/shared/Buttons/DeleteButton";
import CustomSearchBar from "@/components/shared/Searchbar/CustomSearchBar";
import CustomIcon from "@/components/shared/Icons/CustomIcon";
import CustomModal from "@/components/shared/modals/CustomModal";
import { CustomModalLayout } from "@/components/shared/modals";
import AppWrapper from '@/components/shared/FilterCard/example'; 
import { CustomTextField, CustomSelectField, CustomCheckboxGroup, CustomRadio, CustomRating, CustomCheckbox } from "@/components/shared/input-fields";
import type { StakeholderType } from "@/components/shared/input-fields";
import BazarView from "@/components/Event/BazarView";
import TripView from "@/components/Event/TripView";
import BoothView from "@/components/Event/BoothView";
import ConferenceView from "@/components/Event/ConferenceView";
import WorkshopView from "@/components/Event/WorkshopView";
// import Event from "@/components/shared/containers/Event/Event";



export default function HomePage() {
  const eventDetails1 = {
    "Location": "GUC",
    "Start Date": "02/10/2005",
    "End Date": "03/10/2005",
    "Registration Deadline": "01/10/2005",
  } as const;

  const eventDetails2 = {
    "Location": "GUC",
    "Start Date": "02/10/2005",
    "End Date": "03/10/2005",
    "Price": "500 EGP",
  } as const;

  const eventDetails3={
    company: "Lazy Lads",
    people: {
      person1:{ id:"123",
        "Name": "ahmed",
        "Email": "ahmed@gmail.com",
      },
      person2:{ id:"123",
        "Name": "ahmed",
        "Email": "ahmed@gmail.com",
      },
      person3:{ id:"123",
        "Name": "ahmed",
        "Email": "ahmed@gmail.com",
      }
    },
    details :{
    "Start Date":"22-Oct",
    "End Date":"06-Nov",
    "Duration": "2 weeks",
    "Location":"Booth B1 in Platform",
    "Size":"2x2"
    }
  }

  const conference = {
    name: "International Tech Innovation Summit 2025",
    description:
      "A premier conference bringing together tech leaders, innovators, and entrepreneurs to discuss cutting-edge technologies and industry trends. Featuring keynote speeches, panel discussions, networking sessions, and hands-on workshops.",
    agenda: `
      Day 1 - March 15, 2025
      09:00 AM - 09:30 AM: Registration & Breakfast
      09:30 AM - 10:15 AM: Opening Keynote - "The Future of AI"
      10:30 AM - 12:00 PM: Panel Discussion - Emerging Technologies
      12:00 PM - 01:00 PM: Lunch Break
      01:00 PM - 02:30 PM: Workshop - Machine Learning Basics
      02:45 PM - 04:00 PM: Networking Session
      
      Day 2 - March 16, 2025
      09:00 AM - 10:00 AM: Breakfast & Networking
      10:00 AM - 11:30 AM: Workshop - Cloud Computing
      11:45 AM - 01:00 PM: Panel Discussion - Startup Ecosystem
      01:00 PM - 02:00 PM: Lunch Break
      02:00 PM - 03:30 PM: Workshop - Cybersecurity Best Practices
      03:45 PM - 04:30 PM: Closing Keynote & Awards Ceremony
    `,
    details: {
      "Start Date": "March 15, 2025",
      "End Date": "March 16, 2025",
      "Start Time": "09:00 AM",
      "End Time": "04:30 PM",
      "Conference Link": "https://techsummit2025.com/register",
      "Required Budget": "$45,000",
      "Source of Funding": "External - Tech Corp Sponsors",
      "Extra Required Resources": "Projectors, Microphones, Recording Equipment, WiFi Setup, Catering Service",
    },
  };
  const workshop = {
    name: "Advanced Web Development with React & TypeScript",
    location: "GUC Cairo",
    description:
      "A comprehensive hands-on workshop designed to equip students with advanced skills in modern web development. Participants will learn React best practices, TypeScript integration, state management, and build a real-world project.",
    agenda: `
      Day 1 - May 10, 2025
      09:00 AM - 09:30 AM: Introduction & Setup
      09:30 AM - 11:00 AM: React Fundamentals & Hooks Deep Dive
      11:15 AM - 12:45 PM: TypeScript Essentials for React
      12:45 PM - 01:30 PM: Lunch Break
      01:30 PM - 03:00 PM: State Management with Redux
      03:15 PM - 04:30 PM: Hands-on Lab Session
      
      Day 2 - May 11, 2025
      09:00 AM - 10:30 AM: Advanced Patterns & Performance Optimization
      10:45 AM - 12:15 PM: API Integration & Testing
      12:15 PM - 01:00 PM: Lunch Break
      01:00 PM - 02:30 PM: Building a Real-World Project
      02:45 PM - 04:00 PM: Project Presentations & Q&A
    `,
    details: {
      "Start Date": "May 10, 2025",
      "End Date": "May 11, 2025",
      "Start Time": "09:00 AM",
      "End Time": "04:30 PM",
      'Location': "GUC Cairo",
      "Faculty Responsible": "IET - Information & Engineering Technology",
      "Professors Participating": "Dr. Ahmed Hassan, Eng. Mona Karim, Dr. Omar Elsayed",
      "Required Budget": "$8,500",
      "Funding Source": "External - Tech Partners Inc.",
      "Extra Required Resources": "Laptops (40 units), Projectors, Whiteboards, WiFi Setup, Catering, GitHub Access",
      'Capacity': "40 students",
      "Registration Deadline": "May 3, 2025",
    },
  };
  
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    stakeholderType: StakeholderType | '';
  }>({
    firstName: '',
    lastName: '',
    email: '',
    stakeholderType: ''
  });
  /* eslint-disable @typescript-eslint/no-explicit-any */

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // For now, just log the submitted form data
    // Replace with API submission as needed
    // eslint-disable-next-line no-console
    console.log(formData);
    handleClose();
  };


  return (
    <div className=" min-h-screen flex items-center justify-center gap-5 flex-col p-4">
      <CustomModal 
        modalType="delete"
        title="Confirm Action"
        description="Are you sure you want to proceed with this action? This cannot be undone."
        buttonOption1={{
          label: "Cancel",
          variant: "outlined",
          color: "secondary"
        }}
        buttonOption2={{
          label: "Confirm",
          variant: "contained",
          color: "primary",
          onClick: () => console.log("Action confirmed!")
        }}
      />
      <CustomButton onClick={() => setOpen(true)}>Open Modal Layout</CustomButton>
      <CustomModalLayout open={open} onClose={handleClose}>
        <div>
          <div className="flex flex-col gap-6">
            {/* First Name */}
            <CustomTextField
              fieldType="text"
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              neumorphicBox
              fullWidth
            />

            {/* Last Name */}
            <CustomTextField
              fieldType="text"
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              neumorphicBox
              fullWidth
            />

            {/* Stakeholder Type Select */}
            <CustomSelectField
              label="Stakeholder Type"
              fieldType="single"
              options={[
                { label: "Student", value: "student" },
                { label: "Staff", value: "staff" },
                { label: "Vendor", value: "vendor" },
                { label: "Company", value: "company" }
              ]}
              value={formData.stakeholderType}
              onChange={(value) => handleInputChange('stakeholderType', value)}
              required
            />
            {/* Email Field - Tailored by stakeholder type */}
            {formData.stakeholderType && (
              <CustomTextField
                fieldType="email"
                label={`Email (${formData.stakeholderType})`}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                stakeholderType={formData.stakeholderType as StakeholderType}
                required
                neumorphicBox
                fullWidth
              />
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3 mt-4">
              <CustomButton
                variant="outlined"
                label="Cancel"
                onClick={handleClose}
              />
              <CustomButton
                variant="contained"
                label="Sign Up"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </CustomModalLayout>
      <div className="flex items-center justify-center gap-5">
        <CustomButton
          color="tertiary"
          variant="contained"
          size="small"
          disableElevation
          label="Save"
        />
          <CustomButton
          variant="contained"
          size="small"
          disableElevation
          label="Apply"
          color="secondary"
        />
        <CustomButton
          variant="contained"
          size="small"
          disableElevation
          label="Submit"
        />
        <DeleteButton size="small" variant="contained" color="error" />
      </div>
      <CustomIcon icon="delete" size="small" containerType="inwards" />
      <CustomIcon icon="edit" size="large" containerType="outwards" border={false} />
      <CustomSearchBar icon={false} width="800px" type="outwards" label="Search Events..." />
     <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
       <BazarView  details={eventDetails1} name="Summer Bazaar" description="well nothing realmhgjh tuktiupyi orjowkeojkpwef ojjhoihjihijawfe
       fweqwreqhiu
       werqiuwerqiuyw
       reqiyuwrly yayyy rea
       lmhgjhtuktiupyiorjowkeojkpwe
       ojjhoihjihijawf
       efweqwreqhiuwerqiuwe
       rqiuywreqiyuwrly yayyy "/>
       <TripView details={eventDetails2} name="Summer Fiesta" description="well nothing realmhgjh tuktiupyi orjowkeojkpwef ojjhoihjihijawfe
       fweqwreqhiu
       werqiuwerqiuyw
       reqiyuwrly yayyy rea
       lmhgjhtuktiupyiorjowkeojkpwe
       ojjhoihjihijawf
       efweqwreqhiuwerqiuwe
       rqiuywreqiyuwrly yayyy "/>
       </div>

       <BoothView company={eventDetails3.company } details={eventDetails3.details}/>

       <ConferenceView name={conference.name} description={conference.description} agenda={conference.agenda} details={conference.details} />

       <WorkshopView name={workshop.name} description={workshop.description} agenda={workshop.agenda} details={workshop.details}/>
      <AppWrapper />
    </div>
  );
}
