import React from "react";

interface IButton {
  icon: JSX.Element;
  onClick: () => void;
}

const Button: React.FC<IButton> = ({ icon, onClick }) => {
  return (
    <button
      className="text-5xl hover:scale-150 text-white transition-all"
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default Button;
