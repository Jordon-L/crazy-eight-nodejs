import React, { useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckMark from 'components/lobby/checkMark';

// players {"name": name , "ready" : false}


function PlayerTable(props) {

return (
    <TableContainer id = 'table' component = {Paper}>
        <Table aria-label = 'players'>
            <TableHead style = {{display:'table-header-group'}}>
                <TableRow>
                    <TableCell> Player Name </TableCell>
                    <TableCell align = 'right'>Ready?</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.players.map((row) => (
                    <TableRow
                        key = {row.name}
                        sx = {{'&:last-child td, &:last-child th': {border: 0} }}
                    >
                        <TableCell component = 'th' scope = 'row'>
                            {row.name}
                        </TableCell>
                        <TableCell align = 'right'><CheckMark ready = {row.ready}></CheckMark></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);
}

export default PlayerTable
