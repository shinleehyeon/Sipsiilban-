import { Box } from '../Box';
import { BoxProps } from '../Box/Box.type';

export default function VStack({ children, gap, ...restProps }: BoxProps) {
    return (
        <Box direction="column" gap={gap} {...restProps}>
            {children}
        </Box>
    );
}
