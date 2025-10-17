"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import EntityNavigation from "@/components/layout/EntityNavigation";
import RoleAssignmentContent from "@/components/admin/RoleAssignmentContent";
import ManageEventOfficeAccountContent from "@/components/admin/ManageEventOfficeAccountContent";
import AllUsersContent from "@/components/admin/AllUsersContent";
import BlockUnblockUsersContent from "@/components/admin/BlockUnblockUsersContent";
import BrowseEventsContent from "@/components/BrowseEvents/browse-events";
import CourtsBookingContent from "@/components/CourtBooking/CourtsBookingContent";
import VendorRequestsList from "@/components/vendor/Participation/VendorRequestsList";
import VendorUpcomingParticipation from "@/components/vendor/Participation/VendorUpcomingParticipation";
import { mapEntityToRole } from "@/utils";
import GymSchedule from "@/components/gym/GymSchedule";
import BoothForm from "@/components/shared/BoothForm/BoothForm";
import WorkshopDetails from "@/components/EventsOffice/WorkshopDetails";
import WorkshopRequests from "@/components/EventsOffice/WorkshopRequests";
import WorkshopList from "@/components/shared/Professor/WorkshopList";



export default function EntityCatchAllPage() {
  const params = useParams() as {
    locale?: string;
    entity?: string;
    rest?: string[];
  };
  const pathname = usePathname() || "";
  const entity = params.entity ?? "";
  const segments = pathname.split("/").filter(Boolean);
  const tab = segments[2] || "";
  const section = segments[3] || "";
  const [Evaluating, setEvaluating] = useState(false);
  const [specificWorkshop, setSpecificWorkshop] = useState('');
  console.log(entity)
  console.log(tab)
  console.log(section)
  const studentUser ="68e3b87c9ba968e059fc1cd9";
  const professorUser ="68f1433886d20633de05f301" ;

  // Render specific content based on entity, tab, and section
  const renderContent = () => {
     
    // Vendor - Bazaars & Booths tab
    if (entity === "vendor" && tab === "opportunities") {
      if (section === "available") {
        // Interpreting "Available Opportunities" as upcoming accepted participation view for consistency
        return <VendorUpcomingParticipation />;
      }
      if (section === "my-applications") {
        // Interpreting "My Applications" as pending/rejected requests list
        return <VendorRequestsList />;
      }
      if (section === "opportunities") {
        // Interpreting "My Applications" as pending/rejected requests list
        return <BrowseEventsContent registered={false} user="vendor"  userID={studentUser} />;
      }
      if (section === "apply-booth") {
        return <BoothForm />;
      }
    }

    // Courts booking page for stakeholders
    if (
      ["student", "staff", "ta", "professor"].includes(entity) &&
      tab === "courts"
    ) {
      if (section === "reserve" || section === "") {
        return <CourtsBookingContent />;
      }
    }
    // Gym sessions for stakeholders
    if (["student", "staff", "ta", "professor"].includes(entity) && tab === "gym") {
      if (section === "browse-sessions" || section === "") {
        return <GymSchedule />;
      }
      if (section === "my-sessions") {
        return (
          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">My Registered Sessions</h2>
            <p className="text-gray-600">Coming soon: your registered gym sessions.</p>
          </div>
        );
      }
    }

    // Admin content
    if (entity === "admin" && tab === "role-assignment") {
      if (section === "assign-roles") {
        return <RoleAssignmentContent />;
      }
      if (section === "view-assignments") {
        return (
          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Current Assignments</h2>
            <p className="text-gray-600">
              View all current role assignments here.
            </p>
          </div>
        );
      }
      if (section === "role-history") {
        return (
          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Role Change History</h2>
            <p className="text-gray-600">
              View the history of role changes here.
            </p>
          </div>
        );
      }
    }

    // Event Office content
    if (entity === "admin" && tab === "event-office") {
      if (section === "manage-eo-account") {
        return <ManageEventOfficeAccountContent />;
      }
    }

    if (entity === "events-office" && tab === "events") {
      if (section === "my-creations") {
        return <BrowseEventsContent registered={false} user="events-only"  userID={studentUser} />;
      }
    }

    if (entity === "admin" && tab === "users") {
      if (section === "all-users") {
        return <AllUsersContent />;
      }
      if (section === "block-users") {
        return <BlockUnblockUsersContent />;
      }
    }

    if (tab === "workshop-requests") {
      if (section === "all-requests") {
        return Evaluating ? (
          <WorkshopDetails workshopID={specificWorkshop} setEvaluating={setEvaluating} />
        ) : (
          <WorkshopRequests
            setEvaluating={setEvaluating}
            setSpecificWorkshop={setSpecificWorkshop}
          />
        );
      }
    }

    //Shared Content
    if (tab === "events") {
      if (section === "browse-events") {
        return <BrowseEventsContent registered={false} user={entity} userID={studentUser} />;
      }
      if (section === "all-events") {
        return <BrowseEventsContent registered={false} user={entity} userID={studentUser}  />;
      }
    }
    if (tab === "events") {
      if (section === "my-registered") {
        return <BrowseEventsContent registered={true} user="student" userID={studentUser} />;
      }
    }
    
    if(entity==="professor" && tab==="workshops" ){
      if (section === "my-workshops") {
        return  <WorkshopList userId={professorUser}/>;
      }
    }
    // Default placeholder content
    return (
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-4">
          {entity
            ? `${entity.charAt(0).toUpperCase() + entity.slice(1)} Portal`
            : "Entity"}
        </h1>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Current Path:</strong> {pathname}
          </p>
          <p>
            <strong>Entity:</strong> {entity || "none"}
          </p>
          <p>
            <strong>Tab:</strong> {tab || "none"}
          </p>
          <p>
            <strong>Section:</strong> {section || "none"}
          </p>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            👋 Welcome! This is a placeholder page. Your content for{" "}
            <strong>{tab || "this tab"}</strong>
            {section && (
              <>
                {" "}
                → <strong>{section}</strong>
              </>
            )}{" "}
            will go here.
          </p>
        </div>
      </div>
    );
  };

  return (
    <EntityNavigation userRole={mapEntityToRole(entity)}>
      {renderContent()}
    </EntityNavigation>
  );
}
