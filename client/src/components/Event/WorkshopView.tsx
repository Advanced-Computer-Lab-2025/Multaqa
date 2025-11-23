"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton, Tooltip, Divider, Grid, Stack } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import CustomButton from "../shared/Buttons/CustomButton";
import { WorkshopViewProps } from "./types";
import theme from "@/themes/lightTheme";
import { Trash2, MapPin, Users, Calendar, Clock, AlertCircle , Ban} from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import { CustomModal } from "../shared/modals";
import RegisterEventModal from "./Modals/RegisterModal";
import EventCard from "../shared/cards/EventCard";
import { CustomModalLayout } from "../shared/modals";
import EventDetails from "./Modals/EventDetails";
import CancelRegistration from "./Modals/CancelRegistration";
import PaymentDrawer from "./helpers/PaymentDrawer";
import RestrictUsers from "./Modals/RestrictUsers";
import EditWorkshop from "../tempPages/EditWorkshop/EditWorkshop";
import Utilities from "../shared/Utilities";

const WorkshopView: React.FC<WorkshopViewProps> = ({
  id,
  details,
  name,
  description,
  professors,
  icon: IconComponent,
  background,
  agenda,
  user,
  registered,
  isRegisteredEvent,
  onDelete,
  setRefresh,
  userInfo,
  attended,
  datePassed,
  registrationPassed,
  professorStatus,
  evaluateButton,
  commentButton,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<boolean>(false);
  const [register, setRegister] = useState(false);
  const [restrictUsers, setRestrictUsers] = useState(false);
  const [cancelRegisteration, setCancelRegisteration] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const updatedDetails = {...details,professors}
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [edit, setEdit] = useState(false);

   const handlePaymentSuccess = (paymentDetails:any) => {
    console.log('Payment successful:', paymentDetails);
    setPaymentDrawerOpen(false);
    
    // Handle successful payment - redirect, show confirmation, etc.
    alert(`Payment successful! Transaction ID: ${paymentDetails.transactionId}`);
  };

  const startDate = new Date(details["Start Date"]);
  const now = new Date();
  const isRefundable = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) >= 14;

  const handleOpenDeleteModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEventToDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setEventToDelete(false);
  };

  const deleteEventHandler = () => {
    onDelete?.();
    handleCloseDeleteModal();
  };

  const getInitials = (name: string) => {
    let cleanName = name.trim();
    if (cleanName.includes(".")) {
      const dotIndex = cleanName.indexOf(".");
      cleanName = cleanName.substring(dotIndex + 1).trim();
    }
    const parts = cleanName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return cleanName[0].toUpperCase();
  };


  return (
    <>
    <EventCard title={name} attended={attended} startDate={details["Start Date"]} endDate={details["End Date"]} cost ={details["Cost"]} startTime={details["Start Time"]} endTime={details["End Time"]} totalSpots={professorStatus=="approved"?details["Capacity"]:undefined} color={background} leftIcon={<IconComponent />} eventType={"Workshop"} createdBy={details['Created by']} spotsLeft={details["Spots Left"]}  onOpenDetails={() => setDetailsModalOpen(true)} utilities={(user === "events-office" || user === "admin") ? (
        <Stack direction="row" spacing={1}>
         {user ==="events-office" ?
          <Tooltip title ={"Restrict Workshop"}>
          <IconButton
            size="medium"
            onClick={() => setRestrictUsers(true)}
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: `${"#6b7280"}15`,
                  borderColor: "#6b7280",
                  color: "#6b7280",
                },
              }}
          >
            <Ban size={18} />
          </IconButton>
        </Tooltip>
        :<></>}  
        <Tooltip title="Delete Workshop">
          <IconButton
            size="medium"
            onClick={handleOpenDeleteModal}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                borderColor: "error.main",
                color: "error.main",
              },
            }}
          >
            <Trash2 size={18} />
          </IconButton>
        </Tooltip>
        </Stack>
      ) :  user==="professor"? <Tooltip title ="Edit Workshop">
              <IconButton
                size="medium"
                onClick={()=>setEdit(true)}
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: `${background}15`,
                      borderColor: background,
                      color: background,
                    },
                  }}
              >
               <EditIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
      :null}
      commentButton={commentButton}
      registerButton={
        (user == "staff" || user == "student" || user == "ta" || user == "professor") && 
        !(datePassed || attended) && (
          <>
            {registered || isRegisteredEvent ? (
              // User is registered - show cancel button
              <CustomButton
                size="small"
                variant="outlined"
                sx={{ 
                  borderRadius: 999,
                  backgroundColor: `${background}40`,
                  color: background,
                  borderColor: background,
                  fontWeight: 600,
                  px: 3,
                  textTransform: "none",
                  boxShadow: `0 4px 14px ${background}40`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: `${background}50`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 6px 20px ${background}50`,
                  },
                  width: 'fit-content'
                }}
                onClick={() => setCancelRegisteration(true)}
              >
                Cancel Registration
              </CustomButton>
            ) : (
              // User is not registered - show register button
              !(registrationPassed) && (
                  <CustomButton
                    size="small"
                    variant="contained"
                    sx={{ 
                      borderRadius: 999,
                      backgroundColor: `${background}40`,
                      color: background,
                      borderColor: background,
                      fontWeight: 600,
                      px: 3,
                      textTransform: "none",
                      boxShadow: `0 4px 14px ${background}40`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: `${background}50`,
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 20px ${background}50`,
                      },
                    }}
                    onClick={() => setRegister(true)}
                  >
                    Register
                  </CustomButton>
                )
            )}
          </>
        )
      } expanded={expanded} location={details["Location"]} professorStatus={professorStatus} evaluateButton={evaluateButton}/>
       <EditWorkshop
                        workshopId={id}
                        open={edit}
                        workshopName={name}
                        budget={parseInt(details["Required Budget"], 10)}
                        capacity={parseInt(details["Capacity"], 10)}
                        startDate={new Date(details["Start Date"])}
                        endDate={new Date(details["End Date"])}
                        registrationDeadline={
                          new Date(details["Registration Deadline"])
                        }
                        description={description}
                        agenda={agenda}
                        location={details["Location"]}
                        fundingSource={details["Funding Source"]}
                        creatingProfessor={details["Created By"]}
                        faculty={details["Faculty Responsible"]}
                        extraResources={details["Extra Required Resources"]}
                        associatedProfs={professors}
                        onClose={() => {
                          setEdit(false);
                        }}
                      />

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={eventToDelete}
        onClose={handleCloseDeleteModal}
        title="Confirm Deletion"
        description={`Are you sure you want to delete the workshop "${name}"? This action cannot be undone.`}
        modalType="delete"
        borderColor={theme.palette.error.main}
        buttonOption1={{
          label: "Delete",
          variant: "contained",
          color: "error",
          onClick: deleteEventHandler,
        }}
        buttonOption2={{
          label: "Cancel",
          variant: "outlined",
          color: "error",
          onClick: handleCloseDeleteModal,
        }}
      >
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: "text.primary",
              mb: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            {name}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: "#666",
              mb: 1,
              fontSize: "0.95rem",
            }}
          >
            {details["Start Date"] === details["End Date"]
              ? details["Start Date"] || "TBD"
              : `${details["Start Date"] || "TBD"} - ${details["End Date"] || "TBD"}`}
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: theme.palette.error.main,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            This action cannot be undone.
          </Typography>
        </Box>
      </CustomModal>
      <RegisterEventModal 
        open={register}
        onClose={() => { setRegister(false); } }
        eventType={"Workshop"}
        userInfo={userInfo}
        eventId={id}
       color={background} paymentOpen={() => setPaymentDrawerOpen(true)}/>
      <RestrictUsers setRefresh={setRefresh} eventId={id} eventName={name} eventType={"Workshop"} open={restrictUsers} onClose={() => setRestrictUsers(false)} />
      
      <CancelRegistration setRefresh={setRefresh} eventId={id} open={cancelRegisteration} onClose={() => setCancelRegisteration(false)} isRefundable={isRefundable}/>
      <CustomModalLayout
              open={detailsModalOpen}
              onClose={() => setDetailsModalOpen(false)}
              width="w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]"
              borderColor={background}
            >
              <EventDetails
                title={name}
                description={description}
                eventType="Workshop"
                details={updatedDetails}
                color={background}
                agenda={agenda}
                userId={userInfo?._id}
                createdBy={userInfo?._id===details["CreatedId"]?"you": details['Created by']} 
                button={
                  (user == "staff" || user == "student" || user == "ta" || user == "professor") && (
                    !(datePassed || attended) && (
                        <>
                          {registered || isRegisteredEvent ? (
                            // User is registered - show cancel button
                            <CustomButton
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderRadius: 999,
                                backgroundColor: `${background}40`,
                                color: background,
                                borderColor: background,
                                fontWeight: 600,
                                px: 3,
                                textTransform: "none",
                                boxShadow: `0 4px 14px ${background}40`,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  backgroundColor: `${background}50`,
                                  transform: "translateY(-2px)",
                                  boxShadow: `0 6px 20px ${background}50`,
                                },
                                width: 'fit-content'
                              }}
                              onClick={() => setCancelRegisteration(true)}
                            >
                              Cancel Registration
                            </CustomButton>
                          ) : (
                            // User is not registered - show register button
                           !(registrationPassed) && (
                              <CustomButton
                                size="small"
                                variant="contained"
                                sx={{ 
                                  borderRadius: 999,
                                  backgroundColor: `${background}40`,
                                  color: background,
                                  borderColor: background,
                                  fontWeight: 600,
                                  px: 3,
                                  textTransform: "none",
                                  boxShadow: `0 4px 14px ${background}40`,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    backgroundColor: `${background}50`,
                                    transform: "translateY(-2px)",
                                    boxShadow: `0 6px 20px ${background}50`,
                                  },
                                }}
                                onClick={() => setRegister(true)}
                              >
                                Register
                              </CustomButton>
                            )
                          )}
                        </>
                      )
                  )
                }
                sections={user=="vendor"?['general','agenda', 'details']:(professorStatus!=="approved"?['general','agenda','details']:['general','agenda','details',
                  'reviews'])}
                user={user?user:""}
                attended ={attended}
                eventId={id}
              />
            </CustomModalLayout>
             <PaymentDrawer
              open={paymentDrawerOpen}
              onClose={() => setPaymentDrawerOpen(false)}
              totalAmount={parseInt(details["Cost"])}
              walletBalance={userInfo?.walletBalance||0} 
              onPaymentSuccess={handlePaymentSuccess}
              eventId={id}
              email={userInfo?.email}
            />
    </>
  );
};

export default WorkshopView;