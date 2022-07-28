import { Flex, Box } from '@chakra-ui/react';
import ConnectButton from './ConnectButton';
import DisplayClaim from './DisplayClaim';

type Props = {
    handleOpenModal: any;
};

const Claim = ({ handleOpenModal }: Props) => {
    return (
        <Flex

            paddingBottom={10}
            paddingTop={10}
            bgColor={'black'}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="10vh"

        >
            <ConnectButton handleOpenModal={handleOpenModal} />
            <DisplayClaim></DisplayClaim>
        </Flex>
    );
};

export default Claim; 