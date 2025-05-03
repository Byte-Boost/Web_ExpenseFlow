import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
  } from "flowbite-react";

  export function NavBar() {
    return (
      <Navbar fluid rounded>
        <NavbarBrand>
          <img src={"favicon.png"} className="mr-3 h-6 sm:h-9" alt="ExpenseFlow Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Expense Flow</span>
        </NavbarBrand>
        {/* <div className="flex md">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
            }>
            <DropdownHeader>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">name@flowbite.com</span>
            </DropdownHeader>
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Earnings</DropdownItem>
            <DropdownDivider />
            <DropdownItem>Sign out</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div> */}
        <NavbarCollapse>
          <NavbarLink href="#">Projetos</NavbarLink>
          <NavbarLink href="#">Reembolsos</NavbarLink>
          <NavbarLink href="#">Usuários</NavbarLink>
          <NavbarLink href="#">Logout</NavbarLink>
        </NavbarCollapse>
      </Navbar>
    );
  }
  