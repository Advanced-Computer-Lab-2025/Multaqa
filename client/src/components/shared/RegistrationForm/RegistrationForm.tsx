import React from "react";
import { Formik } from "formik";
import { UserType, RegistrationFormProps } from "./types";
import { getValidationSchema } from "./utils";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import Link from "next/link";

const RegistrationForm: React.FC<RegistrationFormProps> = ({ UserType }) => {
  const initialValues =
    UserType !== "vendor"
      ? {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          gucId: "",
        }
      : {
          companyName: "",
          email: "",
          password: "",
          confirmPassword: "",
        };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(UserType)}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <NeumorphicBox
            containerType="outwards"
            padding="30px"
            margin="20px"
            width="600px"
            borderRadius="20px"
          >
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold">Multaqa</h1>
                <p className="text-gray-500">
                  Create your account to get started
                </p>
              </div>

              {/* Conditional Fields */}
              {UserType !== "vendor" ? (
                <>
                  <div className="w-full">
                    <CustomTextField
                      id="firstName"
                      label="First Name"
                      fieldType="text"
                      {...formik.getFieldProps("firstName")}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <CustomTextField
                      id="lastName"
                      label="Last Name"
                      fieldType="text"
                      {...formik.getFieldProps("lastName")}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <CustomTextField
                      id="studentId"
                      label="Student/Staff ID"
                      fieldType="text"
                      {...formik.getFieldProps("gucId")}
                    />
                    {formik.touched.gucId && formik.errors.gucId && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.gucId}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <CustomTextField
                    id="companyName"
                    label="Company Name"
                    fieldType="text"
                    {...formik.getFieldProps("companyName")}
                  />
                  {formik.touched.companyName && formik.errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.companyName}
                    </p>
                  )}
                </div>
              )}

              {/* Common Fields */}
              <div className="w-full">
                <CustomTextField
                  id="email"
                  label="Email"
                  fieldType="email"
                  stakeholderType={UserType as UserType}
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="w-full">
                <CustomTextField
                  id="password"
                  label="Password"
                  fieldType="password"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div className="w-full">
                <CustomTextField
                  id="confirmPassword"
                  label="Confirm Password"
                  fieldType="password"
                  {...formik.getFieldProps("confirmPassword")}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              {/* Submit Button */}
              <div className="w-full mt-4">
                <CustomButton
                  type="submit"
                  variant="contained"
                  width="100%"
                  disableElevation
                  label={formik.isSubmitting ? "Submitting..." : "Submit"}
                  disabled={formik.isSubmitting}
                  className="w-full"
                />
              </div>

              {/* Sign In Link */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-purple-600 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </NeumorphicBox>
        </form>
      )}
    </Formik>
  );
};

export default RegistrationForm;
