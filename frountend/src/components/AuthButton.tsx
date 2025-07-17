import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { siteConfig } from "@/config/site";

export default function AuthButton(): JSX.Element {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  let buttonText = "Login";
  let buttonLink = siteConfig.links.login;

  if (token && role !== null) {
    if (role === "0") {
      buttonText = "Your Applications";
      buttonLink = "/user";
    } else if (role === "1") {
      buttonText = "Hi, "+localStorage.getItem("name");
      buttonLink = "/hr";
    }
  }

  return (
    <Button
      color="primary"
      as={Link}
      className="text-sm font-normal"
      to={buttonLink}
      variant="flat"
    >
      {buttonText}
    </Button>
  );
}
