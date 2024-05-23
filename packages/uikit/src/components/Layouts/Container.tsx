import { Box, BoxProps } from "../Box";

const Container: React.FC<React.PropsWithChildren<BoxProps>> = ({ children, ...props }) => (
  <Box px={["16px", "16px", "20px", "20px", "24px"]} mx="auto" maxWidth="1248px" {...props}>
    {children}
  </Box>
);

export default Container;
