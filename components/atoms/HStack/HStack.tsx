import { Box } from '../Box';
import { BoxProps } from '../Box/Box.type';

export default function HStack({ children, ...restProps }: BoxProps) {
    return (
        <Box direction="row" {...restProps}>
            {children}
        </Box>
    );
}
