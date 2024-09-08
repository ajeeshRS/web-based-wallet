import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
export default function DropDownMenu({ chooseCrypto }: any) {
  const [selectValue, setSelectValue] = useState<string>("Select");

  return (
    <Menu
      as="div"
      className="relative text-left sm:mx-2 mx-1 sm:text-md text-xs"
    >
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-[#272727] px-3 py-3.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-black hover:bg-[#393939]">
          {selectValue}
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 h-5 w-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-[#272727] shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <p
              className="block px-4 py-2 text-sm text-white data-[focus]:bg-[#343333] cursor-pointer"
              onClick={() => {
                chooseCrypto("ETH");
                setSelectValue("ETH");
              }}
            >
              ETH
            </p>
          </MenuItem>
          <MenuItem>
            <p
              className="block px-4 py-2 text-sm text-white data-[focus]:bg-[#343333] cursor-pointer"
              onClick={() => {
                chooseCrypto("SOL");
                setSelectValue("SOL");
              }}
            >
              SOL
            </p>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
