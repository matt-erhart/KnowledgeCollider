                         
      if (false && this.state.simulationReady) {
           return ( 
               <ReactSVGPanZoom
                    style={{outline: "1px solid black"}}
                    width={1024} height={1024} ref={Viewer => this.Viewer = Viewer}>
           <svg height='1500' width='1500'>
                {this.state.graph.nodes.map((node,i)=> {
                    return <CircleCss key={node.id} cx={node.x} cy={node.y} r='5'/>
                })}
                {this.state.graph.nodes.map((node,i)=> {
                    return <RectCss key={node.id} x={node.x-10} y={node.y-10} width='20' height='20'/>
                })}
                {this.state.graph.links.map((link,i)=> {
                    return <LinkCss key={link.id} x1={link.source.x} y1={link.source.y} x2={link.target.x} y2={link.target.y}/>
                })}
           </svg>
              </ReactSVGPanZoom>
          )
      } else {
          if (!this.state.bboxesReady){
                return (
                <svg height='1500' width='1500'>
                    {this.state.graph.nodes.map((node, i) => {
                        return <Text key={node.id} ref={node.id}
                            x={50} y={50} width={100}>{node.name}</Text>
                    })}
                </svg>
            )
          } 
        }