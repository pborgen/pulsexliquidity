
import { Flex, Text } from '@chakra-ui/react';


const GridHeader = () => {

    return (
        <>
            <Flex
                marginTop={0}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="20vh"
                maxHeight="20vh"

                bgSize="cover"
                color='white'
                bgPosition={'center'}
                bgColor='white'
            >
                <Text color="#00cc66">Below is a list of the tokens on PulseX.</Text>
            </Flex >
        </>
    );
};

export default GridHeader; 