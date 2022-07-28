
import { Image, Link, Box, Center } from '@chakra-ui/react';

const Social = () => {

    return (
        <>
            <Box p={4} bgColor={'black'} >
                <Center>
                    <Link href="https://twitter.com/Pulsexliquidity" isExternal color="black">
                        <Image marginRight={3} boxSize='100px' objectFit='cover' backgroundPosition={'center'} src='image/twitter/twitter_icon.png'></Image>
                    </Link>
                </Center>
            </Box >

        </>
    );
};

export default Social; 