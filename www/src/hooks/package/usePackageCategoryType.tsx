import React from "react";
import axiosInstance from "@/config/axios.config"; // Assuming you have axiosInstance configured properly

/**
 * Custom hook to fetch package types.
 * @returns {{ packageCategoryTypes: any[], loading: boolean, error: string|null }} An object containing packageTypes, loading state, and error state.
 */
function usePackageCategoryTypes() {
  const [packageCategoryTypes, setPackageCategoryTypes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axiosInstance.get("/package_category/get");
        setPackageCategoryTypes(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message || "An error occurred");
        setLoading(false);
      }
    }

    fetchData();

    // Clean-up function (optional)
    return () => {
      // Perform any necessary clean-up here
    };
  }, []);

  return { packageCategoryTypes, loading, error };
}

export default usePackageCategoryTypes;
