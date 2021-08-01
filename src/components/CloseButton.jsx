import { FaTimes } from "react-icons/fa";
export default function CloseButton({ onClick, floating }) {
  return (
    <div
      className={
        floating
          ? "rounded-full bg-gray-300 p-1 absolute right-0 top-0 cursor-pointer"
          : "rounded-full bg-gray-300 p-1 h-4 w-4 flex justify-center items-center cursor-pointer"
      }
      onClick={onClick}
    >
      <FaTimes className="w-3 h-3" />
    </div>
  );
}
