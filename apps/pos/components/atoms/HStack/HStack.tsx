import { Box } from '../Box';
import { BoxProps } from '../Box/Box.type';

export default function HStack({ children, gap, ...restProps }: BoxProps) {
    return (
        <Box direction="row" gap={gap} {...restProps}>
            {children}
        </Box>
    );
}
