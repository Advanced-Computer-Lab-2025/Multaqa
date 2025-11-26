// import { Box, Typography } from "@mui/material";

// const MiniCalendar = ({
//   current,
//   sessions,
//   onDateClick,
// }: {
//   current: Date;
//   sessions: GymSession[];
//   onDateClick: (date: Date) => void;
// }) => {
//   const year = current.getFullYear();
//   const month = current.getMonth();
//   const firstDay = new Date(year, month, 1);
//   const lastDay = new Date(year, month + 1, 0);
//   const startingDayOfWeek = firstDay.getDay();
//   const daysInMonth = lastDay.getDate();

//   // Get days with sessions
//   const daysWithSessions = new Set(
//     sessions
//       .filter((s) => {
//         const d = new Date(s.start);
//         return d.getFullYear() === year && d.getMonth() === month;
//       })
//       .map((s) => new Date(s.start).getDate())
//   );

//   const today = new Date();
//   const isToday = (day: number) => {
//     return (
//       today.getFullYear() === year &&
//       today.getMonth() === month &&
//       today.getDate() === day
//     );
//   };

//   const days = [];
//   // Empty cells for days before the first day of month
//   for (let i = 0; i < startingDayOfWeek; i++) {
//     days.push(<Box key={`empty-${i}`} />);
//   }
//   // Days of the month
//   for (let day = 1; day <= daysInMonth; day++) {
//     const hasSessions = daysWithSessions.has(day);
//     const isTodayDate = isToday(day);
//     days.push(
//       <Tooltip
//         key={day}
//         title={hasSessions ? "Has sessions" : "No sessions"}
//         arrow
//       >
//         <Box
//           onClick={() => {
//             const clickedDate = new Date(year, month, day);
//             onDateClick(clickedDate);
//           }}
//           sx={{
//             aspectRatio: "1",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: "0.75rem",
//             fontWeight: isTodayDate ? 700 : 500,
//             borderRadius: "50%",
//             cursor: "pointer",
//             backgroundColor: isTodayDate
//               ? "#6299d0"
//               : hasSessions
//               ? alpha("#6299d0", 0.15)
//               : "transparent",
//             color: isTodayDate ? "#fff" : "#333",
//             border:
//               hasSessions && !isTodayDate
//                 ? `2px solid ${alpha("#6299d0", 0.4)}`
//                 : "none",
//             transition: "all 0.2s ease",
//             "&:hover": {
//               backgroundColor: isTodayDate ? "#5089c0" : alpha("#6299d0", 0.25),
//               transform: "scale(1.1)",
//             },
//           }}
//         >
//           {day}
//         </Box>
//       </Tooltip>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         backgroundColor: "#fff",
//         borderRadius: "16px",
//         p: 2,
//         boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//         maxWidth: 280,
//       }}
//     >
//       <Typography
//         variant="subtitle2"
//         sx={{
//           fontWeight: 700,
//           mb: 1.5,
//           textAlign: "center",
//           color: "#6299d0",
//         }}
//       >
//         {current.toLocaleString(undefined, { month: "long", year: "numeric" })}
//       </Typography>
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: "repeat(7, 1fr)",
//           gap: 0.5,
//           mb: 1,
//         }}
//       >
//         {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
//           <Box
//             key={i}
//             sx={{
//               fontSize: "0.7rem",
//               fontWeight: 600,
//               color: "#999",
//               textAlign: "center",
//             }}
//           >
//             {day}
//           </Box>
//         ))}
//       </Box>
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: "repeat(7, 1fr)",
//           gap: 0.5,
//         }}
//       >
//         {days}
//       </Box>
//       <Box
//         sx={{
//           mt: 2,
//           pt: 1.5,
//           borderTop: "1px solid rgba(0,0,0,0.08)",
//           display: "flex",
//           justifyContent: "space-around",
//           fontSize: "0.7rem",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//           <Box
//             sx={{
//               width: 12,
//               height: 12,
//               borderRadius: "50%",
//               backgroundColor: "#6299d0",
//             }}
//           />
//           <Typography variant="caption">Today</Typography>
//         </Box>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//           <Box
//             sx={{
//               width: 12,
//               height: 12,
//               borderRadius: "50%",
//               border: `2px solid ${alpha("#6299d0", 0.4)}`,
//               backgroundColor: alpha("#6299d0", 0.15),
//             }}
//           />
//           <Typography variant="caption">Has sessions</Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };