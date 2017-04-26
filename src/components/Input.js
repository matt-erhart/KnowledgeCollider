import React from 'react';

export default (props) => {
    return (
    <form onSubmit={e=>{e.preventDefault()}}>
       <input type="number" name="topN" defaultValue={10} onChange={e =>  props.setTopN(parseInt(e.target.value))}></input>
    </form>
    )
}