"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import LoadingBlocks from "@/components/shared/LoadingBlocks";
import AnimatedLoading from "@/components/shared/AnimatedLoading";
import EntityNavigation from "@/components/layout/EntityNavigation";
import RoleAssignmentContent from "@/components/admin/RoleAssignmentContent";
import ManageEventOfficeAccountContent from "@/components/admin/ManageEventOfficeAccountContent";
import AllUsersContent from "@/components/admin/AllUsersContent";
import BlockUnblockUsersContent from "@/components/admin/BlockUnblockUsersContent";
import BrowseEventsContent from "@/components/BrowseEvents/browse-events";
import FavoritesList from "@/components/BrowseEvents/FavoritesList";
import CourtsBookingContent from "@/components/CourtBooking/CourtsBookingContent";
import VendorRequestsList from "@/components/vendor/Participation/VendorRequestsList";
import VendorUpcomingParticipation from "@/components/vendor/Participation/VendorUpcomingParticipation";
import GymSchedule from "@/components/gym/GymSchedule";
import GymSessionsManagementContent from "@/components/gym/GymSessionsManagementContent";
import MyRegisteredSessions from "@/components/gym/MyRegisteredSessions";
import BoothForm from "@/components/shared/BoothForm/BoothForm";
import WorkshopDetails from "@/components/EventsOffice/WorkshopDetails";
import WorkshopRequests from "@/components/EventsOffice/WorkshopRequests";
import WorkshopList from "@/components/shared/Professor/WorkshopList";
import { WorkshopViewProps } from "@/components/Event/types";
import { useAuth } from "@/context/AuthContext";
import VendorParticipationRequests from "@/components/EventsOffice/VendorRequests/VendorParticipationRequests";
import Wallet from "@/components/Wallet/Wallet";
import VectorFloating from "@/components/shared/VectorFloating";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import ScaledViewport from "@/components/layout/ScaledViewport";
import LoyaltyProgram from "@/components/shared/LoyaltyProgram/LoyaltyProgram";
import NotificationsPageContent from "@/components/notifications/NotificationsPageContent";
import PollsManagement from "@/components/EventsOffice/Polls/PollsManagement";
import PollList from "@/components/Polls/PollList";
import VendorsList from "@/components/shared/Vendor/vendorLayout";
import ReportTable from "../../../../components/shared/Report/reportTable";
import AllVendorsList from "@/components/EventsOffice/AllVendors/AllVendorsList";
import FlaggedComments from "@/components/shared/Comments/FlaggedComments";
import TeamsDescription from "@/components/UsheringAccount/TeamsDescription";
import BugReportForms from "@/components/Bugs/BugReportForms";
import BugReports from "@/components/Bugs/BugReports";
import UsheringApplications from "@/components/shared/UsheringTeamApplications/UsheringApplications";
import InterviewSlotManager from "@/components/UsheringAccount/InterviewSlotManager";
import Guidelines from "@/components/UsheringAccount/Guidelines";
import NotificationHub from "@/components/UsheringAccount/NotificationHub";
import InterviewBookingPage from "@/components/interviewReservation/InterviewBookingPage";

// Helper: Maps backend user object to URL entity segment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserEntitySegment = (user: any): string => {
  if (!user) return "";

  // Backend: role: "student"
  if (user.role === "student") return "student";

  // Backend: role: "vendor"
  if (user.role === "vendor") return "vendor";

  // Backend: role: "staffMember" with position sub-role
  if (user.role === "staffMember") {
    if (user.position === "professor") return "professor";
    if (user.position === "TA") return "ta";
    if (user.position === "staff") return "staff";
    return "staff"; // default fallback
  }

  // Backend: role: "usherAdmin" (top-level role)
  if (user.role === "usherAdmin") return "usher-admin";

  // Backend: role: "administration" with roleType sub-role
  if (user.role === "administration") {
    if (user.roleType === "admin") return "admin";
    if (user.roleType === "eventsOffice") return "events-office";
    return "admin"; // default fallback
  }

  return "student"; // ultimate fallback
};

const getEventsOfficeName = (user: any): string => {
  if (!user) return "";

  if (user.role === "administration") {
    if (user.roleType === "eventsOffice") return String(user?.name);
  }

  return ""; // ultimate fallback
};

const SignedOutFallback = ({ onGoToLogin }: { onGoToLogin: () => void }) => {
  const [showAction, setShowAction] = useState(false);

  useEffect(() => {
    const hintTimer = window.setTimeout(() => setShowAction(true), 1200);
    return () => window.clearTimeout(hintTimer);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 text-gray-900">
      <div className="absolute inset-0 -z-10 opacity-45">
        <VectorFloating />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/40 bg-white/80 p-10 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/70 shadow-inner">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-[#6299d0] border-t-transparent"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          Redirecting to sign in
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          We safely closed your session. Hang tight while we guide you back to
          the login screen.
        </p>

        <CustomButton
          variant="contained"
          color="primary"
          onClick={onGoToLogin}
          label={showAction ? "Open login" : "Take me to login"}
          sx={{
            mt: 6,
            width: "100%",
            maxWidth: 240,
            mx: "auto",
            fontWeight: 700,
          }}
        />

        <p className="mt-4 text-xs text-gray-500">
          Not seeing the login page? Tap the button above or use the quick link
          below.
        </p>

        <p className="mt-2 text-xs font-semibold">
          <Link
            href="/login"
            className="text-[#6299d0] transition-colors duration-200 hover:text-[#4c82b9]"
          >
            Open login in a new view
          </Link>
        </p>
      </div>
    </div>
  );
};

export default function EntityCatchAllPage() {
  const params = useParams() as {
    locale?: string;
    entity?: string;
    rest?: string[];
  };
  const pathname = usePathname() || "";
  const router = useRouter();
  const entityFromUrl = params.entity ?? "";
  // Use params.rest for tab and section instead of parsing pathname manually
  const restSegments = params.rest || [];
  const tab = restSegments[0] || "";
  const section = restSegments[1] || "";

  const [Evaluating, setEvaluating] = useState(false);
  const [specificWorkshop, setSpecificWorkshop] = useState<WorkshopViewProps>();
  const { user, isLoading } = useAuth();
  const userId = String(user?._id);
  let eventOfficeName = getEventsOfficeName(user);
  const [countdown, setCountdown] = useState(3);
  // Track if login redirect should be shown
  const showLoginRedirect = !user && !isLoading;
  // Track if a redirect is pending for logged-in users
  const [redirecting, setRedirecting] = useState(false);

  // Track last valid public route for unauthenticated users
  useEffect(() => {
    if (!user && !isLoading) {
      // Only track public routes (not /login, not /register, not /404, not /error)
      if (!pathname.match(/\/login|\/register|\/404|\/error/)) {
        sessionStorage.setItem("lastValidPublicRoute", pathname);
      }
    }
  }, [pathname, user, isLoading]);

  // Get the correct entity segment from backend user data
  const correctEntitySegment = getUserEntitySegment(user);

  // Helper: Get valid tabs/sections for current user role
  const roleMap: Record<string, { tab: string; section: string }> = {
    student: { tab: "events", section: "browse-events" },
    vendor: { tab: "opportunities", section: "bazaars" },
    staff: { tab: "events", section: "browse-events" },
    ta: { tab: "events", section: "browse-events" },
    professor: { tab: "workshops", section: "overview" },
    "events-office": { tab: "events", section: "all-events" },
    admin: { tab: "users", section: "all-users" },
    "usher-admin": { tab: "graduation", section: "" },
  };

  const handleGoToLogin = useCallback(() => {
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    if (!isLoading && !user) {
      const redirectTimer = window.setTimeout(handleGoToLogin, 1800);
      return () => window.clearTimeout(redirectTimer);
    }
  }, [isLoading, user, handleGoToLogin]);

  // Use a more specific type for user (partial, as backend shape is dynamic)
  interface UserLike {
    role?: string;
    position?: string;
    roleType?: string;
  }

  function getValidTabSection(user: UserLike) {
    if (!user) return { tab: "", section: "" };
    let roleKey = "student";
    if (user.role === "student") roleKey = "student";
    else if (user.role === "vendor") roleKey = "vendor";
    else if (user.role === "staffMember") {
      if ("position" in user && user.position === "professor")
        roleKey = "professor";
      else if ("position" in user && user.position === "TA") roleKey = "ta";
      else roleKey = "staff";
    } else if (user.role === "administration") {
      if ("roleType" in user && user.roleType === "eventsOffice")
        roleKey = "events-office";
      else if ("roleType" in user && user.roleType === "usherAdmin")
        roleKey = "usher-admin";
      else roleKey = "admin";
    }
    return roleMap[roleKey] || roleMap["student"];
  }

  // Login redirect effect
  useEffect(() => {
    if (showLoginRedirect) {
      // If route is invalid for public user, redirect to last valid public route
      const lastValidPublicRoute =
        sessionStorage.getItem("lastValidPublicRoute") || "/";
      // If current route is not valid (e.g., too many segments, or not a known public route)
      // Check rest segments length instead of pathname segments
      if (restSegments.length > 2 || pathname.match(/\/404|\/error/)) {
        router.replace(lastValidPublicRoute);
        return;
      }
      // Otherwise, show login redirect as before
      if (countdown <= 0) {
        router.replace("/login");
        return;
      }
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.replace("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showLoginRedirect, countdown, router, pathname, restSegments]);

  // Route validation and redirect effect
  useEffect(() => {
    if (user && !isLoading) {
      // If entity doesn't match, redirect (existing logic)
      if (entityFromUrl && entityFromUrl !== correctEntitySegment) {
        setRedirecting(true);
        const newPath = `/${correctEntitySegment}`;
        router.replace(newPath);
        return;
      }

      // If too many segments (e.g., /en/professor/workshops/my-workshops/asd)
      // Check rest segments length > 2 (tab + section)
      // BUT exclude notifications tab which can have notifications/id (length 2)
      // Actually notifications/id is length 2, so it's fine.
      // But if notifications/id/extra -> length 3 -> redirect.
      // So restSegments.length > 2 is the correct check for most cases.

      if (restSegments.length > 2) {
        setRedirecting(true);
        // Only keep up to /locale/entity/tab/section
        // Construct valid base using entity and first 2 rest segments
        const validBase = `/${correctEntitySegment}/${restSegments[0]}/${restSegments[1]}`;
        router.replace(validBase);
        return;
      }
      // Route is valid - no need to redirect for tab/section validation
      // The navigation component and renderContent handle showing appropriate content
      setRedirecting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    isLoading,
    entityFromUrl,
    correctEntitySegment,
    router,
    restSegments,
  ]);

  // Show loading state for initial load only
  if (isLoading) {
    return <LoadingBlocks />;
  }

  if (showLoginRedirect) {
    // Don't show not-found for public routes, just redirect handled above
    return null;
  }

  // Transition screen if the user is signed out
  if (!user) {
    return <SignedOutFallback onGoToLogin={handleGoToLogin} />;
  }

  // Use the correct entity (from user data, not URL)
  const entity = correctEntitySegment;

  // Render specific content based on entity, tab, and section
  const renderContent = () => {
    // Show welcome screen if no tab is selected
    if (!tab) {
      return (
        // <div className="flex flex-col items-center justify-center min-h-full p-8">
        //   <div className="max-w-2xl text-center">
        //     {/* Undraw illustration and welcome message */}
        //     <div className="mb-8">
        //       {/* ...existing code... */}
        //     </div>
        //     <h1 className="text-4xl font-bold text-gray-900 mb-4">
        //       Welcome to Your {entity.charAt(0).toUpperCase() + entity.slice(1)} Dashboard! 🎉
        //     </h1>
        //     <p className="text-lg text-gray-600 mb-8">
        //       Ready to explore? Choose a tab above to get started with your journey.
        //     </p>
        //     <p className="text-sm text-gray-500 italic">
        //       Click on any tab to begin using the dashboard
        //     </p>
        //   </div>
        // </div>
        <AnimatedLoading />
      );
    }

    if (entity === "usher-admin") {
      if (tab === "graduation") {
        if (section === "teams-description") {
          return <TeamsDescription user="usher-admin" />;
        }
        if(section=="interview-management"){
          return <InterviewSlotManager />
        }
        if (section === "applications") {
          return <UsheringApplications />;
        }
        if (section === "guidelines") {
          return <Guidelines/>;
        }
        if(section ==="notification-service"){
          return <NotificationHub />
        }
      }
    }

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

      if (section === "apply-booth") {
        return <BoothForm />;
      }

      if (section === "bazaars") {
        return (
          <BrowseEventsContent
            registered={false}
            user={"vendor"}
            userInfo={user}
            userID={userId}
          />
        );
      }
    }

    if (
      [
        "student",
        "staff",
        "professor",
        "ta",
        "events-office",
        "admin",
      ].includes(entity) &&
      section === "loyalty-partners"
    ) {
      return <VendorsList />;
    }
    // Vendor - Loyalty Program
    if (entity === "vendor" && tab === "loyalty") {
      if (section === "program-status") {
        return (
          <LoyaltyProgram
            isSubscribed={!!user?.loyaltyProgram}
            discountRate={user?.loyaltyProgram?.discountRate}
            promoCode={user?.loyaltyProgram?.promoCode}
            termsAndConditions={user?.loyaltyProgram?.termsAndConditions}
            onStatusChange={() => window.location.reload()}
          />
        );
      }
    }
    if (
      [
        "student",
        "staff",
        "professor",
        "ta",
        "events-office",
        "admin",
      ].includes(entity) &&
      section === "loyalty-partners"
    ) {
      return <VendorsList />;
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
    if (
      ["student", "staff", "ta", "professor"].includes(entity) &&
      tab === "gym"
    ) {
      if (section === "browse-sessions" || section === "") {
        return <GymSchedule />;
      }
      if (section === "my-sessions") {
        return <MyRegisteredSessions />;
      }
    }

    if (
      ["student", "staff", "ta", "professor", "events-office", "usher-admin"].includes(entity) &&
      tab === "bug-reporting"
    ) {
      if (section === "bug-reporting" || section === "") {
        return <BugReportForms />;
      }
    }

    if (
      ["admin"].includes(entity) &&
      tab === "bug-reporting"
    ) {
      if (section === "bug-reports" || section === "") {
        return <BugReports />;
      }
    }

    if (
      ["student", "staff", "ta", "professor"].includes(entity) &&
      tab === "wallet"
    ) {
      if (section === "overview" || section === "") {
        return <Wallet userID={userId} userInfo={user} />;
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

    // Admin - Vendor Management (labeled as "Vendor Management" under the 'reports' tab in navigation)
    if (entity === "admin" && tab === "reports") {
      if (section === "participation-requests") {
        return <VendorParticipationRequests />;
      }
      if (section === "all-vendors") {
        return <AllVendorsList />;
      }
      if (section === "loyalty-partners") {
        return (
          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">
              Loyalty Program Partners
            </h2>
            <p className="text-gray-600">
              Loyalty partnership management will be available soon.
            </p>
          </div>
        );
      }
      if (section === "documents") {
        return (
          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Vendor Documents</h2>
            <p className="text-gray-600">
              Document storage and approvals are under construction.
            </p>
          </div>
        );
      }
    }

    if (entity === "events-office" && tab === "events") {
      if (section === "my-creations") {
        return (
          <BrowseEventsContent
            registered={false}
            user="events-only"
            userID={userId}
            userInfo={user}
          />
        );
      }
    }

    if (entity === "student" && tab === "graduation") {
      if (section === "teams-description") {
        return <TeamsDescription user="student" />;
      }
    }

    // Admin - Flagged Comments
    if (entity === "admin" && tab === "flagged-comments") {
      return <FlaggedComments />;
    }

    if (entity === "events-office" || entity === "admin") {
      if (section === "attendee-reports")
        return <ReportTable reportType="attendees" />;
      else if (section === "sales-reports")
        return <ReportTable reportType="sales" />;
    }

    if (entity === "admin" && tab === "users") {
      if (section === "all-users") {
        return <AllUsersContent />;
      }
      if (section === "block-users") {
        return <BlockUnblockUsersContent />;
      }
    }

    if (entity === "events-office" && tab === "vendors") {
      if (section === "participation-requests") {
        return <VendorParticipationRequests />;
      }

      if (section === "vendor-polls") {
        return <PollsManagement />;
      }

      if (section === "all-vendors") {
        return <AllVendorsList />;
      }

      if (section === "loyalty-partners") {
        return (
          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">
              Loyalty Program Partners
            </h2>
            <p className="text-gray-600">
              Loyalty partnership management will be available soon.
            </p>
          </div>
        );
      }

      if (section === "documents") {
        return (
          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Vendor Documents</h2>
            <p className="text-gray-600">
              Document storage and approvals are under construction.
            </p>
          </div>
        );
      }
    }

    if (tab === "workshop-requests") {
      return Evaluating && specificWorkshop ? (
        <WorkshopDetails
          workshop={specificWorkshop}
          setEvaluating={setEvaluating}
          eventsOfficeId={eventOfficeName}
        />
      ) : (
        <WorkshopRequests
          setEvaluating={setEvaluating}
          setSpecificWorkshop={setSpecificWorkshop!}
          evaluate={true}
          filter="none"
        />
      );
    }

    // Events Office - Gym Management
    if (entity === "events-office" && tab === "gym") {
      if (section === "sessions-management") {
        return <GymSessionsManagementContent />;
      }
      if (section === "browse-sessions" || section === "") {
        return <GymSchedule eventsOffice={true} />;
      }
    }

    // Events Office - Gym Management
    if (entity === "events-office" && tab === "gym") {
      if (section === "sessions-management") {
        return <GymSessionsManagementContent />;
      }
    }

    //Shared Content
    if (tab === "events") {
      if (section === "browse-events") {
        return (
          <BrowseEventsContent
            registered={false}
            user={entity}
            userID={userId}
            userInfo={user}
          />
        );
      }
      if (section === "favorites") {
        return <FavoritesList userInfo={user} user={entity} />;
      }
      if (section === "polls") {
        return <PollList />;
      }
      if (section === "all-events") {
        return (
          <BrowseEventsContent
            registered={false}
            user={entity}
            userID={userId}
            userInfo={user}
          />
        );
      }
    }
    if (tab === "events") {
      if (section === "my-registered") {
        return (
          <BrowseEventsContent
            registered={true}
            user="student"
            userID={userId}
            userInfo={user}
          />
        );
      }
    }

    if (entity === "professor" && tab === "workshops") {
      return <WorkshopList userId={userId} filter={"none"} userInfo={user} />;
    }

    // Notifications - Available for all entities
    if (tab === "notifications" && (section === "overview" || section === "")) {
      console.log("✅ Notifications tab accessed for entity:", entity);
      return <NotificationsPageContent />;
    }

    if (tab === "graduation" && section === "interview-reservation") {
      return <InterviewBookingPage />;
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
    <ScaledViewport scale={1}>
      <EntityNavigation user={user}>{renderContent()}</EntityNavigation>
      {redirecting && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            pointerEvents: "none",
          }}
        >
          {/* Use AnimatedLoading for overlay */}
          <AnimatedLoading />
        </div>
      )}
    </ScaledViewport>
  );
}
