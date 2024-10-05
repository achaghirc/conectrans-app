import { Metadata } from "next";
import Navbar from "../ui/shared/navbar";
import { CssBaseline } from "@mui/material";

export const metadata:Metadata = {
    title: 'Login',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<CssBaseline />
			{children}
		</>
	);
}