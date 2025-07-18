import { Box } from '../Box';
import { BoxProps } from '../Box/Box.type';

export default function VStack({ children, ...restProps }: BoxProps) {
    return (
        <Box direction="column" {...restProps}>
            {children}
        </Box>
    );
}
