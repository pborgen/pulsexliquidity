import leafs from './leaves';
import { MerkleTree } from 'merkletreejs';
import KECCAK256 from 'keccak256';
import Leaf from './Leaf';
import { solidityKeccak256 } from "ethers/lib/utils.js"; // Ethers utils

// import { Buffer } from "buffer/";
// window.Buffer = window.Buffer || Buffer;
import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

export default class Claim {


    getLeafs(): Leaf[] {
        return leafs;
    }

    getLeaf(addressToFind: string): Leaf {
        const leafs = this.getLeafs();
        let returnValue = {} as Leaf;

        for (let x = 0; x < leafs.length; x++) {
            const leaf = leafs[x];


            if (addressToFind === leaf.address) {
                returnValue = leaf;
                break;
            }
        }

        return returnValue;
    }

    __generateHashedLeaf(address: string, tokenNumber: number): string {

        const tokenNumberAdjusted = parseInt(String(tokenNumber) + "00000000");

        return solidityKeccak256(["address", "uint256"], [address, tokenNumberAdjusted]);
    }

    getProof(address: string) {
        const leaves = this.getLeafs();
        const leaf = this.getLeaf(address);

        const tokenNumber = leaf.tokenNumber;

        const leafHashed = this.__generateHashedLeaf(address, tokenNumber);


        const leavesHashed = leaves.map((element: any): string => {
            const address = element.address;
            const tokenNumber = element.tokenNumber;

            return this.__generateHashedLeaf(address, tokenNumber);
        });

        const tree = new MerkleTree(leavesHashed, KECCAK256, { sortPairs: true });
        const root = tree.getHexRoot();

        console.log(`Root: ${root}`);

        const proof = tree.getHexProof(leafHashed);
        const result = tree.verify(proof, leafHashed, root);
        console.log('result: ' + result);

        return proof;
    }
}