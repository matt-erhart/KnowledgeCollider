import bboxCollide from './boundingBoxCollide'
import * as d3 from 'd3';

export default function forceSimulation(graph, width, height) {
    let bbox_array = [];
    graph.nodes.forEach((node, i) => {
        let bbox = graph.nodes[i].bbox
        bbox_array.push([[-bbox.width / 2 - 5, -bbox.height / 2 - 5], [bbox.width / 2 + 5, bbox.height / 2 + 5]]); //faster to precompute
    })

    let rectangleCollide = bboxCollide((d, i) => bbox_array[i]).strength(.1).iterations(1);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => { return d.id })
            .strength(d => { return d.type == "analogy" ? .2 : 1 }))
        .force("charge", d3.forceManyBody().strength(function (d) {
            return -19 - Math.log(d.paperID.length) * 250 * 4; // give greater repulsion for larger nodes
        }))
        .force("center", d3.forceCenter(width / 2, (height / 2) + 300))
        .velocityDecay(.6)
        .force("collide", rectangleCollide)
        .on('end', () => { console.log('simulation ran') })
        .stop();

    simulation.nodes(graph.nodes)
    simulation.force("link").links(graph.links)

    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
        console.log('/300 ticks');
        simulation.tick();
    }; // run simulation synchronously

    return graph;

}