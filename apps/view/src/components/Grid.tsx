import React from "react";
import { useTable, useSortBy } from "react-table";
import { useState, useEffect } from 'react'
import ApiService from "../api/ApiService";

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex,
    Box,
    Link,
    Text
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { maxHeight } from "@mui/system";

const Grid = () => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [dataAgeInSeconds, setDataAgeInSeconds] = useState<string>("5555");

    const updateGrid =
        async () => {
            let json = await ApiService.getLiquidityPairs();

            const data = json.data;
            const datalLastUpdate = json.lastUpdated;
            const currentTime = Math.round((new Date()).getTime() / 1000);

            setDataAgeInSeconds((currentTime - datalLastUpdate).toLocaleString());

            setRowData(data);
        }

    useEffect(() => {
        updateGrid();
    }, []);

    const data = React.useMemo(
        () => rowData,
        [rowData],
    )

    const columns = React.useMemo(
        () => [
            {
                Header: 'Rank',
                accessor: 'liquidity_rank',

                width: 12,
                minWidth: 12,
                maxWidth: 12,
            },
            {
                Header: 'Pair',
                accessor: 'pairName',

                width: 12,
                minWidth: 12,
                maxWidth: 12,
                Cell: (props: any) => {
                    let linkUrl = '';
                    if (props.row !== undefined) {
                        linkUrl = "https://app.v2b.testnet.pulsex.com/info/pool/" + props.row.original.contractaddressforpair;
                    }


                    return <Link href={linkUrl} isExternal color="green" _hover={{
                        fontWeight: "extrabold"
                    }
                    }>
                        {props.value}
                    </Link >

                },
            },
            {
                Header: 'Liquidity(PLS)',
                accessor: 'liquityInBaseTokenDisplay',
                width: 10,
                minWidth: 10,
                maxWidth: 12,
            },
            {
                Header: 'Quantity',
                accessor: 'token0balancebigDisplay',
                width: 10,
                minWidth: 10,
                maxWidth: 12,
            },
            {
                Header: 'Quantity',
                accessor: 'token1balancebigDisplay',
                width: 10,
                minWidth: 10,
                maxWidth: 12,
            },
            // {
            //     Header: 'Ratio',
            //     accessor: 'ratioDisplay',
            //     width: 10,
            //     minWidth: 10,
            //     maxWidth: 12,
            //     isSorted: false,
            // },
        ],
        [],
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable(
        {
            columns,
            data
        },
        useSortBy
    );

    return (
        <>
            <Flex
                marginTop={0}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="5vh"
                maxHeight="5vh"

                bgSize="cover"
                color='white'
                bgPosition={'center'}
                bgColor='white'
            >
                <Text fontSize={20} color="red">Data Last Updated {dataAgeInSeconds} Seconds Ago</Text>
            </Flex >
            <Box overflow={'auto'} maxHeight={"70vh"}>
                <Table {...getTableProps()}>
                    <Thead>
                        {headerGroups.map((headerGroup) => (
                            <Tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    // Add the sorting props to control sorting. For this example
                                    // we can add them into the header props
                                    <Th
                                        width={column.width} minWidth={column.minWidth}
                                        userSelect="none"
                                        {...column.getHeaderProps(column.getSortByToggleProps())}

                                    >
                                        <Flex alignItems="center">
                                            {column.render("Header")}
                                            {/* Add a sort direction indicator */}
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <ChevronDownIcon ml={1} w={4} h={4} />
                                                ) : (
                                                    <ChevronUpIcon ml={1} w={4} h={4} />
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </Flex>
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <Tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <Td width={cell.column.width} minWidth={cell.column.minWidth} {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </Td>
                                        );
                                    })}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>

            </Box >
        </>
    );
}


export default Grid;
