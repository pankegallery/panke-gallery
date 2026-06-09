import styled from 'styled-components';

export const RsvpSection = styled.section`
  padding: 40px 0;
  
  h2 {
    margin-bottom: 20px;
  }
`;

export const RsvpFormContainer = styled.div`
  h3 {
    margin-bottom: 20px;
    font-size: 1.2em;
  }
`;

export const RsvpForm = styled.form`
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: ${props => props.theme.fontWeights.normal};
    }
    
    input[type="text"],
    input[type="email"],
    textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid ${props => props.theme.colors.theme.black};
      border-radius: 2px;
      font-size: ${props => props.theme.fontSizes.medium};
      font-family: monospace;
      
      &:focus {
        outline: none;
        border-color: #555;
      }
      
      &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
      }
    }
    
    textarea {
      resize: vertical;
      min-height: 100px;
    }
  }
  
  .honeypot-field {
    position: absolute;
    left: -9999px;
  }
`;

export const RsvpSubmitButton = styled.button`
  font-size: ${props => props.theme.fontSizes.medium};
  text-align: center;
  color: ${props => props.theme.colors.theme.black};
  padding: 10px 20px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: ${props => props.theme.colors.theme.black} 2px solid;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.theme.black};
    color: ${props => props.theme.colors.theme.white};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RsvpError = styled.div`
  padding: 12px 16px;
  margin-bottom: 20px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
`;

export const RsvpSuccess = styled.div`
  padding: 20px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  p {
    margin-bottom: 0;
  }
`;

export const RsvpClosed = styled.div`
  padding: 15px;
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  border-radius: 5px;
`;
