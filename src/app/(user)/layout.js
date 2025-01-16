import Navbar from "../../components/NavBar/NavBar";

export default function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}