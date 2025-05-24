import {
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
  } from "flowbite-react";

  export function NavBar() {
    return (
      <Navbar fluid rounded>
        <NavbarBrand href="/">
          <img src={"/images/favicon.png"} className="mr-3 h-6 sm:h-9" alt="ExpenseFlow Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Expense Flow</span>
        </NavbarBrand>
        <NavbarCollapse>
          <NavbarLink href="/projects">Projetos</NavbarLink>
          <NavbarLink href="/users">Usuários</NavbarLink>
          <NavbarLink href="/login"><span className="font-bold text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-600">Logout</span></NavbarLink>
        </NavbarCollapse>
      </Navbar>
    );
  }
  