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
  
  let emptySlots = Object.keys(props.players).length;
  
  function generateRow(name, ready){
    return (<>
      <TableRow
        key = {name}
        sx = {{'&:last-child td, &:last-child th': {border: 0} }}
      >
        <TableCell component = 'th' scope = 'row'>
          {name}
        </TableCell>
      <TableCell align = 'right'><CheckMark ready = {ready}></CheckMark></TableCell>
      </TableRow> 
    </>)
  }
  function populateSlots(players){
    const rows = [];
    players.map((row) => (
      rows.push(generateRow(row.name,row.ready))
    ));
    for(let i = emptySlots; i < 4 ; i++){
      rows.push(generateRow(`empty slot ${i+1}`, false));
    }
    return rows;
  }
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
              {populateSlots(props.players)}
            </TableBody>
        </Table>
    </TableContainer>
);
}

export default PlayerTable
