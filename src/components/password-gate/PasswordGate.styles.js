import styled from 'styled-components';

export const Screen = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5em;
`;

export const Form = styled.form`
  width: 100%;
  max-width: 320px;
  text-align: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.7em 1em;
  margin: 1em 0;
  border: 1px solid ${props => props.theme.colors.theme.black};
  border-radius: 999px;
  background: none;
  color: ${props => props.theme.colors.theme.black};
  font-size: ${props => props.theme.fontSizes.medium};
  text-align: center;

  &::placeholder {
    color: ${props => props.theme.colors.theme.grey};
  }
`;

export const Submit = styled.button`
  width: 100%;
  padding: 0.7em 1em;
  border: 1px solid ${props => props.theme.colors.theme.black};
  border-radius: 999px;
  background: ${props => props.theme.colors.theme.black};
  color: ${props => props.theme.colors.theme.white};
  font-size: ${props => props.theme.fontSizes.medium};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: opacity 0.15s ease;

  @media (hover: hover) {
    &:hover {
      opacity: 0.85;
    }
  }

  &:active {
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorNote = styled.p`
  color: ${props => props.theme.colors.theme.grey};
  font-size: ${props => props.theme.fontSizes.small};
`;
