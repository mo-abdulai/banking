import { logoutAccount } from "@/lib/actions/user.action";
import Image from "next/image";
import { router } from "next/router";
import React from "react";

const Footer = ({ user, type = "desktop" }: FooterProps) => {

  const handleLoggedOut = async () => {
    
     const logout = await logoutAccount()
     if(logout){
      router.push("/sign-in")
     }
  }
  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-700">{user?.firstName[0]}</p>
      </div>
      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className="tex-14 truncate font-semibold text-gray-600">
          {user?.firstName}
        </h1>
        <p className="text-14 truncate font-normal text-gray-600">
          {" "}
          {user?.email}
        </p>
      </div>
      <div className="footer_image" onClick={handleLoggedOut}>
      <Image src="icons/logout.svg" fill alt="logout"/>
      </div>
    </footer>
  );
};

export default Footer;
