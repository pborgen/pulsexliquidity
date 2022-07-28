import { Button, Box, Flex, useToast, Text, Spinner } from "@chakra-ui/react";
import { useEthers, useNetwork, useEtherBalance } from "@usedapp/core";
import Claim from '../claim/Claim';
import * as React from 'react';
import { useEffect } from 'react'
import { Contract } from '@ethersproject/contracts';
import Leaf from '../claim/Leaf';
import { ethers, BigNumber } from 'ethers';
import Const from '../helper/Const';
import leafs from '../claim/leaves';

import { solidityKeccak256 } from "ethers/lib/utils.js"; // Ethers utils


export default function DisplayClaim() {

    const toast = useToast()
    const toastIdRef = React.useRef()

    const [tokens, setTokens] = React.useState<number>(-1);

    const [loading, setLoading] = React.useState<boolean>(false);

    const [canClaim, setCanClaim] = React.useState<boolean>(false);
    const [hasClaimed, setHasClaimed] = React.useState<boolean>(false);

    const [totalSupply, setTotalSupply] = React.useState<number>();

    const claim = new Claim();

    const { library: provider, connector, activateBrowserWallet, account, active } = useEthers();

    const {
        network: { provider: networkProvider, chainId, accounts, errors },
        deactivate,
        activate,
        isLoading,
    } = useNetwork()

    function addToastSuccess(numberOfTokensClaimed: number) {
        toast({
            title: `Success!!! ${numberOfTokensClaimed} tokens have been Claimed!!!`,
            status: 'success',
            isClosable: true,
        })
    }

    const getContract = (): Contract => {
        return new ethers.Contract(Const.getContractAddress(), abi, provider);
    }

    const getContractWithSigner = (): Contract => {
        if (provider !== undefined) {
            return new ethers.Contract(Const.getContractAddress(), abi, provider.getSigner());
        } else {
            throw new Error('Provider is undefined');
        }
    }

    const getTotalSupply = async () => {

        try {
            const contract = getContract();

            const newtTotalSupply: BigNumber = await contract.totalSupply();

            const newtTotalSupplyFormatted = ethers.utils.formatUnits(newtTotalSupply.toString(), 8);

            setTotalSupply(parseInt(newtTotalSupplyFormatted));
        } catch (e) {
            console.error('Issue in getTotalSupply:' + e);
        }
    }

    const checkIfClaimed = async (address: string): Promise<boolean> => {
        let addressHasClaimed = true;

        try {
            const contract = getContract();

            addressHasClaimed = await contract.isClaimed(address);

        } catch (e) {
            console.error('Issue in hasClaimed:' + e);
        }

        return addressHasClaimed;
    }

    const isAddressClaimable = async (address: string): Promise<boolean> => {
        let returnValue = false;

        let leavesHashed = [];
        const leaf: Leaf = claim.getLeaf(address);

        if (leaf.address !== undefined) {


            const proof = claim.getProof(address);


            for (let x = 0; x < leafs.length; x++) {
                const address = leafs[x].address
                const tokenNumber = leafs[x].tokenNumber;
                const tokenNumberAdjusted = parseInt(String(tokenNumber) + "00000000");

                const hashed = solidityKeccak256(["address", "uint256"], [address, tokenNumberAdjusted]);

                leavesHashed.push(hashed);
            }

            try {
                const tokenNumberAdjusted = parseInt(String(leaf.tokenNumber) + "00000000");

                returnValue = await getContract().isClaimable(address, tokenNumberAdjusted, proof);
            } catch (e) {
                console.error(e);
            }
        }

        return returnValue;
    }

    const claimOnClick = async () => {

        if (account) {

            const proof = claim.getProof(account);
            const leaf: Leaf = claim.getLeaf(account);
            let result;
            try {
                if (provider !== undefined) {
                    const tokenNumberAdjusted = parseInt(String(leaf.tokenNumber) + "00000000");
                    result = await getContractWithSigner().claim(account, tokenNumberAdjusted, proof);
                    console.log(result);

                    setCanClaim(false);
                    addToastSuccess(leaf.tokenNumber);
                } else {
                    console.error('Provider is undefined');
                }

            } catch (e) {
                console.error(e);
            }
        } else {
            console.log('Address is not defined');
        }
    }

    const init = async (address: string) => {
        setLoading(true);
        const leaf: Leaf = claim.getLeaf(address);

        if (leaf.tokenNumber !== undefined) {
            setTokens(leaf.tokenNumber);
        }

        const addressHasClaimed = await checkIfClaimed(address);

        if (addressHasClaimed) {
            setCanClaim(false);
        } else {
            const checkIfAddressIsClaimable = await isAddressClaimable(address);

            if (checkIfAddressIsClaimable) {
                setCanClaim(true);
            } else {
                setCanClaim(false);
            }
        }

        setLoading(false);
    }

    useEffect(() => {
        if (account !== undefined) {
            init(account);
        }

        getTotalSupply();

    }, [account]);


    return (
        <Flex padding={5} alignItems='center' display='inline-block'>
            {!loading ?
                <>
                    {canClaim ?
                        <>
                            <Box
                                display="flex"
                                marginTop={0}
                                padding={5}
                                alignItems="center"
                                background="gray.700"
                                borderRadius="xl"
                                color={"Highlight"}
                                py="2"
                            >
                                You can Claim: {tokens.toLocaleString()}
                            </Box>
                            <Box
                                display="center"
                                marginTop={2}
                                marginLeft={16}
                                alignItems="center"
                                borderRadius="xl"
                                py="2"
                            >
                                <Button onClick={claimOnClick} marginTop={2} colorScheme='blue'>Claim!!</Button>
                            </Box>
                        </>
                        :
                        <>
                            {account !== undefined && !loading ?
                                <Box
                                    display="flex"
                                    marginTop={2}
                                    padding={5}
                                    alignItems="center"
                                    background="gray.700"
                                    borderRadius="xl"
                                    color={"Highlight"}
                                    py="2"
                                >
                                    {account === undefined ? <></> : <></>}
                                    {account !== undefined && tokens !== -1 ?
                                        <Text color="#00cc66">This address has claimed {tokens.toLocaleString()} Tiffany Inu (TIFF) tokens</Text>
                                        :
                                        <></>
                                    }

                                    {account !== undefined && tokens === -1 ?
                                        <Text color="#00cc66">Sorry, this address is not able to claim any Tiffany Inu (TIFF) tokens</Text>
                                        : <></>
                                    }
                                </Box>
                                :
                                <>
                                </>
                            }
                        </>
                    }

                </>
                :
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            }

        </Flex>
    );


}
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Claim",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes32[]",
                "name": "proof",
                "type": "bytes32[]"
            }
        ],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes32[]",
                "name": "proof",
                "type": "bytes32[]"
            }
        ],
        "name": "isClaimable",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "isClaimed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];