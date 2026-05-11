import { ButtonContainer } from "./styles";

const Button = ({ label, onClick, expand }) => {
  return (
    <ButtonContainer onClick={onClick} expand={expand} label={label}>
      {label}
    </ButtonContainer>
  );
};

export default Button;
