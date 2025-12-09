// API utility functions for flagged comments feature
import { api } from "../../../../api";
import { toast } from "react-toastify";
import { FlaggedComment, FlaggedCommentsResponse } from "../types";

/**
 * Fetch all flagged comments from the API
 */
export const fetchFlaggedComments = async (): Promise<FlaggedComment[]> => {
    try {
        const response = await api.get<FlaggedCommentsResponse>("/events/flagged-comments");

        if (response.data.success) {
            return response.data.data;
        }

        throw new Error(response.data.message || "Failed to fetch flagged comments");
    } catch (err: any) {
        const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Failed to fetch flagged comments. Please try again.";

        toast.error(errorMessage, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });

        throw err;
    }
};

/**
 * Delete a comment from an event
 */
export const deleteComment = async (
    eventId: string,
    userId: string
): Promise<boolean> => {
    try {
        await api.delete(`/events/${eventId}/reviews/${userId}`);

        toast.success("Comment deleted successfully!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });

        return true;
    } catch (err: any) {
        const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Failed to delete comment. Please try again.";

        toast.error(errorMessage, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });

        return false;
    }
};

/**
 * Block a user
 */
export const blockUser = async (userId: string): Promise<boolean> => {
    try {
        await api.post(`/users/${userId}/block`);

        toast.success("User blocked successfully!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });

        return true;
    } catch (err: any) {
        const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Failed to block user. Please try again.";

        toast.error(errorMessage, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });

        return false;
    }
};
