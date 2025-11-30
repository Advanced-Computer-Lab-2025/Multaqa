import * as Yup from "yup";
import { toast } from "react-toastify";
import { FormikHelpers } from "formik";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface LoginValues {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    role?: string;
    roleType?: string;
    position?: string;
  };
}

export const getValidationSchema = () =>
  Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Please enter your email address."),
    password: Yup.string().required("Please enter your password."),
  });

export const handleLoginSubmit = async (
  values: LoginValues,
  { setSubmitting }: FormikHelpers<LoginValues>,
  login: (credentials: LoginValues) => Promise<LoginResponse | undefined>,
  router: AppRouterInstance,
  getRedirectPath: (role: string) => string
) => {
  try {
    const response = await login(values);

    // Get user info from login response
    let userRole;
    if (response?.user?.role === "administration") {
      userRole = response?.user?.roleType;
    } else if (response?.user?.role === "staffMember") {
      userRole = response?.user?.position;
    } else {
      userRole = response?.user?.role;
    }

    toast.success("Login successful! Redirecting...", {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    // Short delay for toast to be visible before redirect
    setTimeout(() => {
      const redirectPath = getRedirectPath(String(userRole));
      router.push(redirectPath!);
    }, 1500);
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {

    const message =
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong. Please try again.";

    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  } finally {

    setSubmitting(false);
  }
};
export const getRedirectPath = (role: string) => {
  // DON'T include locale - i18n router adds it automatically
  // useRouter() from @/i18n/navigation handles locale prefixing
  const roleRedirects: Record<string, string> = {
    admin: "/admin/users/all-users",
    student: "/student/events/browse-events",
    staff: "/staff/events/browse-events",
    TA: "/ta/events/browse-events",
    professor: "/professor/workshops/my-workshops",
    eventsOffice: "/events-office/events/all-events",
    vendor: "/vendor/opportunities/available",
  };

  return roleRedirects[role] || "/student/events/browse-events";
};
