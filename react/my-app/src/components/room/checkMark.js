/*
    File name: checkMark.js
    Description: Display a check mark
*/

import React, { useEffect,useState } from 'react'
import CheckIcon from '@mui/icons-material/Check';


function CheckMark(props) {
    const [show, setShow] = useState({display : 'None'});

    useEffect(() =>{
        if(props.ready){
            setShow({display : 'inline'});
        }
        else{
            setShow({display : 'None'});
        }
    }, [props.ready]);

    return (
        <div>
            <CheckIcon sx = {show}></CheckIcon>
        </div>   
    );
}


export default CheckMark