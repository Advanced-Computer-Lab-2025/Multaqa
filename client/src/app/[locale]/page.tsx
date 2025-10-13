/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import CustomTextField from '@/components/shared/input-fields/CustomTextField';
import CustomSelectField from '@/components/shared/input-fields/CustomSelectField';
import CustomCheckboxGroup from '@/components/shared/input-fields/CustomCheckboxGroup';
import CustomRating from '@/components/shared/input-fields/CustomRating';
import { CustomModal, CustomModalLayout } from '@/components/shared/modals';
import theme from '@/themes/lightTheme';
import CreateBazaar from '@/components/tempPages/CreateBazaar/CreateBazaar';
import CustomButton from '@/components/shared/Buttons/CustomButton';
import CreateTrip from '@/components/tempPages/CreateTrip/CreateTrip';
import EditTrip from '@/components/tempPages/EditTrip/EditTrip';
import EditBazaar from '@/components/tempPages/EditBazaar/EditBazaar';

const SimpleFormExample: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: '',
    interests: [] as string[],
    rating: 0,
  });
  const [openLayout, setOpenLayout] = useState(false);
  const [openCreateBazaar, setOpenCreateBazaar] = useState(false);
  const [openEditBazaar, setOpenEditBazaar] = useState(false);
  const [openCreateTrip, setOpenCreateTrip] = useState(false);
  const [openEditTrip, setOpenEditTrip] = useState(false);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCallApi = async () => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      // TODO: Replace with your API route
      const res = await api.get("/events");
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || "API call failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f9fafb",
      }}
    >
      <button
        onClick={handleCallApi}
        disabled={loading}
        style={{
          padding: "16px 32px",
          fontSize: "1.25rem",
          fontWeight: 600,
          borderRadius: "12px",
          backgroundColor: "#7851da",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          margin: "32px 0",
        }}
      >
        {loading ? "Calling API..." : "Call API"}
      </button>
      {error && (
        <div style={{ color: "red", marginBottom: "24px" }}>{error}</div>
      )}
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {Array.isArray(response) &&
          response.length > 0 &&
          response.map((event: any) => (
            <div
              key={event._id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                padding: "24px",
                marginBottom: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#7851da",
                  margin: 0,
                }}
              >
                {event.event_name}
              </h2>
              <div style={{ color: "#374151", fontWeight: 500 }}>
                {event.type.toUpperCase()}
              </div>
              <div style={{ color: "#6b7280" }}>{event.location}</div>
              <div style={{ color: "#6b7280" }}>
                Start: {new Date(event.event_start_date).toLocaleString()}
              </div>
              <div style={{ color: "#6b7280" }}>
                End: {new Date(event.event_end_date).toLocaleString()}
              </div>
              <div style={{ color: "#6b7280" }}>
                Price: {event.price ? `$${event.price}` : "Free"}
              </div>
              <div style={{ color: "#6b7280" }}>
                Description: {event.description}
              </div>
              {event.vendors &&
                Array.isArray(event.vendors) &&
                event.vendors.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Vendors:</strong>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {event.vendors.map((v: any) => (
                        <li key={v._id}>
                          Vendor ID: {v.vendor}
                          <br />
                          Booth Size:{" "}
                          {v.RequestData?.value?.boothSize ||
                            v.RequestData?.data?.value?.boothSize ||
                            "N/A"}
                          <br />
                          Attendees:{" "}
                          {Array.isArray(v.RequestData?.value?.bazaarAttendees)
                            ? v.RequestData.value.bazaarAttendees
                                .map((a: any) => a.name)
                                .join(", ")
                            : "N/A"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ))}
      </div>

      <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <CustomModal
          title="Example Modal"
          description="This is a simple example of the CustomModal component."
          buttonOption1={{
            label: 'Close',
            variant: 'contained',
            color: 'primary',
            onClick: () => alert('Modal closed!'),
          }}
          buttonOption2={{
            label: 'Save',
            variant: 'contained',
            color: 'secondary',
            onClick: () => alert('Secondary action clicked!'),
          }}
          modalType="warning"
          // borderColor="#7851da" // Optional custom border color
          width="w-[90vw] sm:w-[80vw] md:w-[40vw]"
          open={false}
          borderColor={theme.palette.primary.main}
          onClose={() => {
          }}
        />

        <button onClick={() => setOpenLayout(true)} style={{ padding: '10px 14px', borderRadius: '10px' }}>Open Layout Modal</button>

        <CustomModalLayout open={openLayout} onClose={() => setOpenLayout(false)} width="w-[90vw] sm:w-[80vw] md:w-[60vw]">
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginTop: 0 }}>Hellow there</h2>
            <p>This is content inside the real <code>CustomModalLayout</code>.</p>
          </div>
        </CustomModalLayout>

        <CustomButton onClick={() => setOpenCreateBazaar(true)}>Create Bazaar</CustomButton>
        <CustomModalLayout open={openCreateBazaar} onClose={() => setOpenCreateBazaar(false)} width="w-[90vw] sm:w-[80vw] md:w-[60vw]">
          <CreateBazaar  setOpenCreateBazaar={setOpenCreateBazaar}/>
        </CustomModalLayout>

        <CustomButton onClick={() => setOpenEditBazaar(true)}>Edit Bazaar</CustomButton>  
        <CustomModalLayout open={openEditBazaar} onClose={() => setOpenEditBazaar(false)} width="w-[90vw] sm:w-[80vw] md:w-[60vw]">
          <EditBazaar
            setOpenEditBazaar={setOpenEditBazaar} 
            bazaarId='1'
            bazaarName='hey'
            location='67'
            description='hey'
            startDate={new Date("10/15/2025, 12:00:00 PM")}
            endDate={new Date("10/18/2025 12:00:00 PM")}
            registrationDeadline={new Date("10/14/2025, 12:00:00 PM")}
          />
        </CustomModalLayout>

        <CustomButton onClick={() => setOpenCreateTrip(true)}>Create Trip</CustomButton>
        <CustomModalLayout open={openCreateTrip} onClose={() => setOpenCreateTrip(false)} width="w-[90vw] sm:w-[80vw] md:w-[60vw]">
          <CreateTrip setOpenCreateTrip={setOpenCreateTrip}/>
        </CustomModalLayout>

        <CustomButton onClick={() => setOpenEditTrip(true)}>Edit Trip</CustomButton>  
        <CustomModalLayout open={openEditTrip} onClose={() => setOpenEditTrip(false)} width="w-[90vw] sm:w-[80vw] md:w-[60vw]">
          <EditTrip 
            setOpenEditTrip={setOpenEditTrip} 
            tripId='1'
            tripName='Sample Trip'
            location='Sample Location'
            price={100}
            description='This is a sample trip description.'
            startDate={new Date("October 17, 2025 03:24:00")}
            endDate={new Date("October 20, 2025 03:24:00")}
            registrationDeadline={new Date("October 11, 2025 03:24:00")}
            capacity={50}
          />
        </CustomModalLayout>
      </div>

      {/* Props Guide */}
      <section style={{ 
        marginTop: '40px',
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 600, 
          marginBottom: '16px',
          color: '#374151' 
        }}>
          📚 Quick Props Reference
        </h2>

        
        <div style={{ 
          display: 'grid', 
          gap: '8px',
          fontSize: '0.9rem',
          color: '#4b5563',
          lineHeight: '1.6'
        }}>
          <div><strong>CustomTextField Props:</strong></div>
          <div style={{ paddingLeft: '12px' }}>
            • <strong>fieldType:</strong> &quot;text&quot; | &quot;email&quot; | &quot;password&quot; | &quot;phone&quot; | &quot;numeric&quot;
          </div>
          <div style={{ paddingLeft: '12px' }}>
            • <strong>separateLabels:</strong> true (outwards neumorphic) | false (MUI standard)
          </div>
          <div style={{ paddingLeft: '12px' }}>
            • <strong>stakeholderType:</strong> &quot;student&quot; | &quot;staff&quot; | &quot;ta&quot; | &quot;professor&quot; | &quot;admin&quot; | &quot;vendor&quot;
          </div>
          <div style={{ paddingLeft: '12px' }}>
            • <strong>required:</strong> Shows red asterisk (*)
          </div>
          
          <div style={{ marginTop: '12px' }}><strong>CustomSelectField Props:</strong></div>
          <div style={{ paddingLeft: '12px' }}>
            • <strong>fieldType:</strong> &quot;single&quot; | &quot;multiple&quot;
          </div>
          <div style={{ paddingLeft: '12px' }}>
            • <strong>options:</strong> Array of &#123;label, value&#125; objects
          </div>
          
          <div style={{ marginTop: '12px' }}><strong>CustomCheckboxGroup Props:</strong></div>
          <div style={{ paddingLeft: '12px' }}>
            • <strong>enableMoreThanOneOption:</strong> true (checkboxes) | false (radio)
          </div>
          <div style={{ paddingLeft: '12px' }}>
            • <strong>multaqaFill:</strong> Uses primary color (#7851da)
          </div>
          
          <div style={{ marginTop: '12px' }}><strong>CustomRating Props:</strong></div>
          <div style={{ paddingLeft: '12px' }}>
            • <strong>multaqaFill:</strong> Uses primary color instead of yellow
          </div>
        </div>
      </section>
    </div>
  );
};

export default SimpleFormExample;
