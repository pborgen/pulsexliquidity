
import { Flex, Text, Box, Center, Progress, ProgressLabel, Link, GridItem } from '@chakra-ui/react';

type Props = {
    totalSupply: number
};

const TopHeading = () => {

    return (
        <>
            <Flex
                marginTop={0}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                padding={3}

                bgSize="cover"
                color='white'
                bgPosition={'center'}
                bgColor='black'
            >
                <Text fontSize={20} color="#00cc66">Below is a list of the tokens on PulseX.</Text>
                <Text fontSize={20} color="#00cc66">This list algorithmically generated with data directly from the chain.</Text>
                <Text fontSize={20} color="#00cc66">Currenly the rank is caculated by how much PLS is in a liquidity pool.</Text>
            </Flex >
        </>
    );
};

export default TopHeading; 