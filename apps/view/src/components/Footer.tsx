import { Flex, Text, Link } from '@chakra-ui/react';


const Footer = () => {
    return (
        <Flex
            w="full"
            bg="blackAlpha.50"
            minHeight="5vh"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            justifyContent="center"
        >
            <Text mb="3">
                Copyright 2022 Informed By Data® | All Rights Reserved | Gettem
            </Text>

        </Flex>
    );
};

export default Footer; 