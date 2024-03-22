import { styled } from 'styled-components'

export const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-bottom: 16px;
  width: 100%;
  max-width: 400px;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`
