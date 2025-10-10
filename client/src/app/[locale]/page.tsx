import CustomButton from "@/components/shared/Buttons/CustomButton";
import DeleteButton from "@/components/shared/Buttons/DeleteButton";
import CustomSearchBar from "@/components/shared/Searchbar/CustomSearchBar";
import CustomIcon from "@/components/shared/Icons/CustomIcon";
import RegisterBox from "@/components/RegistredComponent/Registree";

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px',
      backgroundColor: 'transparent',
      minHeight: '100vh',
      fontFamily: 'var(--font-poppins), system-ui, sans-serif',
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 600, 
        marginBottom: '16px',
        color: '#1f2937',
        textAlign: 'center' 
      }}>
        Simple Form Example
      </h1>

      <p style={{
        fontSize: '1rem',
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        A complete form showing all input component types with their key props
      </p>

      {/* Form Container */}
      <div style={{
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}>
        
        {/* TEXT FIELD - First Name */}
        <div style={{ marginBottom: '24px' }}>
          {/* Props demonstrated:
              - separateLabels: Uses StyledDefaultTextField with outwards neumorphic styling
              - required: Shows red asterisk (*)
              - autoCapitalizeName: Auto-capitalizes input (e.g., "john" → "John")
              - fieldType="text": Text input with user icon
              Alternative props to try:
              - disableDynamicMorphing={false}: Enables focus morph animation
              - disabled: Disables the field
              - placeholder="Custom placeholder": Override default placeholder
          */}
          <CustomTextField
            label="First Name"
            fieldType="text"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            required
            separateLabels
            autoCapitalizeName
          />
        </div>

        {/* TEXT FIELD - Last Name */}
        <div style={{ marginBottom: '24px' }}>
          {/* Additional text field showing same features */}
          <CustomTextField
            label="Last Name"
            fieldType="text"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            required
            separateLabels
            // neumorphicBox
            autoCapitalizeName
          />
        </div>

        {/* EMAIL FIELD */}
        <div style={{ marginBottom: '24px' }}>
          {/* Props demonstrated:
              - fieldType="email": Email input with envelope icon
              - stakeholderType="staff": Auto-appends @guc.edu.eg domain
              Other stakeholderType options:
              - "student": Appends @student.guc.edu.eg
              - "professor", "ta", "admin", "events-office": Appends @guc.edu.eg
              - "vendor": No domain restriction (free input)
          */}
          <CustomTextField
            label="Email"
            fieldType="email"
            stakeholderType="staff"
            value={formData.email}
            onChange={handleChange('email')}
            separateLabels
            neumorphicBox
            required
          />
        </div>

        {/* PASSWORD FIELD */}
        <div style={{ marginBottom: '24px' }}>
          {/* Props demonstrated:
              - fieldType="password": Password input with lock icon
              - Built-in show/hide password toggle (eye icon)
              - Toggle icon uses primary color (#7851da) on hover
              - Placeholder gives password strength tip
          */}
          <CustomTextField
            label="Password"
            fieldType="password"
            value={formData.password}
            onChange={handleChange('password')}
            neumorphicBox
            required
          />
        </div>

        {/* SELECT FIELD */}
        <div style={{ marginBottom: '24px' }}>
          {/* Props demonstrated:
              - fieldType="single": Single selection dropdown
              - options: Array of {label, value} objects
              Alternative props to try:
              - fieldType="multiple": Allow multiple selections
              - neumorphicBox: Adds neumorphic styling
              - disabled: Disables the field
              - size="small" | "medium": Adjust field size
          */}
          <CustomSelectField
            label="User Type"
            fieldType="single"
            options={[
              { label: 'Student', value: 'student' },
              { label: 'Staff', value: 'staff' },
              { label: 'Professor', value: 'professor' },
              { label: 'Admin', value: 'admin' },
            ]}
            value={formData.userType}
            onChange={handleSelectChange}
            required
          />
        </div>

        {/* CHECKBOX GROUP */}
        <div style={{ marginBottom: '24px' }}>
          {/* Props demonstrated:
              - enableMoreThanOneOption: Allow multiple selections (checkbox behavior)
              - multaqaFill: Uses primary color (#7851da) for checkboxes
              Alternative props to try:
              - enableMoreThanOneOption={false}: Acts as radio group (single selection)
              - row: Display options horizontally
              - size="small" | "medium": Adjust checkbox size
              - error: Show error state
              - helperText: Show helper/error message
          */}
          <CustomCheckboxGroup
            label="Interests"
            options={[
              { label: 'Sports', value: 'sports' },
              { label: 'Music', value: 'music' },
              { label: 'Technology', value: 'tech' },
              { label: 'Art', value: 'art' },
            ]}
            onChange={handleCheckboxChange}
            enableMoreThanOneOption={true}
            multaqaFill
          />
        </div>

        {/* RATING */}
        <div style={{ marginBottom: '24px' }}>
          {/* Props demonstrated:
              - multaqaFill: Uses primary color (#7851da) instead of default yellow
              Alternative props to try:
              - size="small" | "medium" | "large": Adjust star size
              - precision={0.5}: Allow half-star ratings
              - readOnly: Make rating read-only
              - max={10}: Change maximum rating (default is 5)
          */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '1rem',
              fontWeight: 500,
              color: '#999',
              fontFamily: 'var(--font-poppins), system-ui, sans-serif',
            }}>
              Rating
            </label>
            <CustomRating
              value={formData.rating}
              onChange={handleRatingChange}
              multaqaFill={true}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#7851da',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-poppins), system-ui, sans-serif',
            boxShadow: '-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.25)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={(e) => {
            e.preventDefault();
            console.log('Form Data:', formData);
            alert('Form submitted! Check console for data.');
          }}
        >
          Submit
        </button>

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
      </div>
      <CustomSearchBar icon={false} width="450px" type="outwards" />
      <CustomIcon icon="delete" size="small" containerType="inwards" />
      <CustomIcon icon="edit" size="large" containerType="outwards" border={false} />
      <RegisterBox></RegisterBox>
    </div>
  );
};

export default SimpleFormExample;