  // this precalculates the bounding box around titles so we can pass
  // that rectangle into d3-force's collision function
  // this way, titles don't overlap
  
export default function calcBBoxes(svgSelection /*d3 selection from react component*/,
                                   nodes){
    // in react component, do something like svgSelection = d3.select(ReactDOM.findDOMNode(this))
    // then call the component to get the measuremnets

    let bboxes = []; //going to fill this with text bounding boxes as d3 puts titles on the nodes
        var textSizeTest = 
        svgSelection.append("g").selectAll(".bbox")
        .data(nodes)
        .enter()
        .append("text").attr('class','bbox')
        .attr('x',0)
        .attr('y',0)
        .attr("font-size", 20)
        .attr('id', function (d) {
           return 'label' + d.id;  })
        .attr('dy', "1em") 
        .attr('fill', 'black')
        .text(d => d.name)
        .attr('transform', function (d) {
            var box = this.getBBox();
            box.width = box.width*1.1;
            box.height = box.height + 2;
            bboxes.push(box)
            return "translate(0,0)"
        })
        textSizeTest.remove() // delete each element used to measure text
    return bboxes;
  }

function sizeText(d, state) {
    if (state === 'init' || state === 'reset'){
         return parseInt(6 + Math.log(d.paperID.length) * 10).toString() + 'px';
    }
    if (state === 'selected') {
        if (d.type === "paper") {
                return 16;
            } else {
                return parseInt(8 + Math.log(d.paperID.length) * 10).toString() + 'px';
            }
    }
}