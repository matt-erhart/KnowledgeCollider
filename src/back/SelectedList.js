import React from 'react';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.css'

export const UnorderedListCss = styled.ul`
  flex: 1;
`

//work in progress
// export const ListItemBootstrap = (props) => {<li className="list-group-item"></li>}
// export const ListBootstrap = (props) => {<ul className="list-group"></ul>}

export const ItemCss = styled.li`
    background-color: white;
    padding: 2px;
    cursor: pointer;
    font-size: xx-small;
    list-style-type: none;
`

export const TitleItemCss = styled(ItemCss)`
    background-color: lightblue;
    font-weight: bold;
`

export const FlexContainerCss = styled.div`
    text-align: left;
    font-size: xx-small;
    display: flex;
    align-content: stretch;
    align-items: stretch;
`
export const ListFromArray = (props) => {
    return (
        <UnorderedListCss>
            <TitleItemCss>{props.title}</TitleItemCss>
            {props.children.array.map((node, i) => {<ItemCss key={'node' + i}>  {node} </ItemCss>})}
        </UnorderedListCss>
    )
}

export default (props) => {
    console.log(props)
    if (props.neighbors.hasOwnProperty('paperNames') && props.neighbors.paperNames.length > 0) {
        return (
        <FlexContainerCss>
            <ListFromArray > {props.neighbors.paperNames } </ListFromArray>
        </FlexContainerCss>

            

        )
    } else {
        return  <ItemCss>Select a Node</ItemCss>
    }
}


            /*<ul className="flexItem list-group">
                <li style={{ 'backgroundColor': 'lightblue' }} className="list-group-item"><b>Papers</b></li>
                {props.neighbors.paperNames.map((node, i) => {
                    return <li className="list-group-item" key={'selected-' + i}>  {node} </li>
                })}
                <li style={{ 'backgroundColor': 'lightblue' }} className="list-group-item"><b>Authors</b></li>
                {props.neighbors.authors.map((node, i) => {
                    return <li className="list-group-item" key={'selected-' + i}>  {node} </li>
                })}
                <li style={{ 'backgroundColor': 'lightblue' }} className="list-group-item"><b>Neighbor Nodes</b></li>
                {props.neighbors.nodeNames.map((node, i) => {
                    return <li className="list-group-item" key={'selected-' + i}>  {node} </li>
                })}
            </ul>)*/