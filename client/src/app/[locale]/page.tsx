'use client';

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

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-semibold mb-4">Welcome to Multaqa</h1>
      <p className="text-sm text-gray-600 mb-6">Select your role to continue.</p>

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
}