import { useMediaQuery, Theme } from "@mui/material";

const useIsMobile = () => {
    return useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
};

export default useIsMobile;