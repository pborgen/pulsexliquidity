import { Flex, Text, Link } from '@chakra-ui/react';


const Header = () => {
    return (
        <Flex
            w="full"
            bg='rgb(0, 204, 68)'
            color={'green'}
            minHeight="4vh"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            justifyContent="center"
        >
            <Text fontSize='2xl' mb="3" marginTop={2}>
                <Link href="https://twitter.com/Pulsexliquidity" isExternal color="black">
                    PulsexLiquidity® on Twitter
                </Link>
            </Text>
        </Flex>
    );
};

export default Header; 