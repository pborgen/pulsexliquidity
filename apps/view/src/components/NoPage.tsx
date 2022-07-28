import { Flex, Text, Link, Center } from '@chakra-ui/react';
import Header from './Header';

import Footer from './Footer';

const NoPage = () => {
    return (
        <>
            <Header></Header>
            <Center>
                <Text fontSize={50}>Where Am I?</Text>
            </Center>
            <Footer></Footer>
        </>
    );
};

export default NoPage; 