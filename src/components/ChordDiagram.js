import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { Maximize2, X, ChevronLeft } from 'lucide-react';
import {
    hospitalSupply,
    hospitalDemand,
    velocityColors,
    chordMetrics,
    generateFlowData
} from '../data/chordDiagramData';

const ChordDiagram = () => {
    const svgRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });

    // Independent state for left and right sides
    const [leftLevel, setLeftLevel] = useState(1);
    const [rightLevel, setRightLevel] = useState(1);
    const [leftBreadcrumb, setLeftBreadcrumb] = useState([{ level: 1, name: 'All Supply' }]);
    const [rightBreadcrumb, setRightBreadcrumb] = useState([{ level: 1, name: 'All Demand' }]);
    const [selectedLeftNode, setSelectedLeftNode] = useState(null);
    const [selectedRightNode, setSelectedRightNode] = useState(null);

    // Get current data based on independent drill-down levels
    const getCurrentData = useCallback(() => {
        let supplyData, demandData;

        // Left side (Supply) data
        if (leftLevel === 1) {
            supplyData = hospitalSupply.level1;
        } else if (leftLevel === 2 && selectedLeftNode) {
            supplyData = hospitalSupply.level2[selectedLeftNode.id] || [];
        } else if (leftLevel === 3 && selectedLeftNode) {
            supplyData = hospitalSupply.level3[selectedLeftNode.parentId || selectedLeftNode.id] || [];
        }

        // Right side (Demand) data
        if (rightLevel === 1) {
            demandData = hospitalDemand.level1;
        } else if (rightLevel === 2 && selectedRightNode) {
            demandData = hospitalDemand.level2[selectedRightNode.id] || [];
        } else if (rightLevel === 3 && selectedRightNode) {
            demandData = hospitalDemand.level3[selectedRightNode.parentId || selectedRightNode.id] || [];
        }

        return { supplyData, demandData };
    }, [leftLevel, rightLevel, selectedLeftNode, selectedRightNode]);

    // Handle left side node click
    const handleLeftClick = useCallback((node) => {
        if (leftLevel === 1 && hospitalSupply.level2[node.id]) {
            setSelectedLeftNode(node);
            setLeftLevel(2);
            setLeftBreadcrumb([...leftBreadcrumb, { level: 2, name: node.name }]);
        } else if (leftLevel === 2 && hospitalSupply.level3[node.id]) {
            setSelectedLeftNode({ ...node, parentId: node.id });
            setLeftLevel(3);
            setLeftBreadcrumb([...leftBreadcrumb, { level: 3, name: node.name }]);
        }
    }, [leftLevel, leftBreadcrumb]);

    // Handle right side node click
    const handleRightClick = useCallback((node) => {
        if (rightLevel === 1 && hospitalDemand.level2[node.id]) {
            setSelectedRightNode(node);
            setRightLevel(2);
            setRightBreadcrumb([...rightBreadcrumb, { level: 2, name: node.name }]);
        } else if (rightLevel === 2 && hospitalDemand.level3[node.id]) {
            setSelectedRightNode({ ...node, parentId: node.id });
            setRightLevel(3);
            setRightBreadcrumb([...rightBreadcrumb, { level: 3, name: node.name }]);
        }
    }, [rightLevel, rightBreadcrumb]);

    // Handle back navigation for left side
    const handleLeftBack = useCallback(() => {
        if (leftBreadcrumb.length > 1) {
            const newBreadcrumb = leftBreadcrumb.slice(0, -1);
            const lastCrumb = newBreadcrumb[newBreadcrumb.length - 1];

            setLeftBreadcrumb(newBreadcrumb);
            setLeftLevel(lastCrumb.level);

            if (lastCrumb.level === 1) {
                setSelectedLeftNode(null);
            }
        }
    }, [leftBreadcrumb]);

    // Handle back navigation for right side
    const handleRightBack = useCallback(() => {
        if (rightBreadcrumb.length > 1) {
            const newBreadcrumb = rightBreadcrumb.slice(0, -1);
            const lastCrumb = newBreadcrumb[newBreadcrumb.length - 1];

            setRightBreadcrumb(newBreadcrumb);
            setRightLevel(lastCrumb.level);

            if (lastCrumb.level === 1) {
                setSelectedRightNode(null);
            }
        }
    }, [rightBreadcrumb]);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear previous content
        d3.select(svgRef.current).selectAll('*').remove();

        const width = isExpanded ? 1600 : 1100;
        const height = isExpanded ? 800 : 500;
        const margin = { top: 50, right: 280, bottom: 20, left: 280 };

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        const { supplyData, demandData } = getCurrentData();

        if (!supplyData || !demandData || supplyData.length === 0 || demandData.length === 0) {
            return;
        }

        // Generate flow data
        const supplyIds = supplyData.map(d => d.id);
        const demandIds = demandData.map(d => d.id);
        const flowData = generateFlowData(leftLevel, rightLevel, supplyIds, demandIds);

        // Create nodes array - PRESERVE ORDER
        const nodes = [
            ...supplyData.map(cat => ({
                ...cat,
                type: 'supply'
            })),
            ...demandData.map(cat => ({
                ...cat,
                type: 'demand'
            }))
        ];

        // Create links array
        const links = flowData.map(flow => ({
            source: nodes.findIndex(n => n.id === flow.source),
            target: nodes.findIndex(n => n.id === flow.target),
            value: flow.quantity,
            velocity: flow.velocity,
            ordered: flow.ordered,
            delivered: flow.delivered,
            timeHours: flow.timeHours
        })).filter(link => link.source >= 0 && link.target >= 0);

        // Create Sankey generator
        const sankeyGenerator = sankey()
            .nodeWidth(20)
            .nodePadding(10)
            .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

        // Generate Sankey layout
        const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
            nodes: nodes.map(d => Object.assign({}, d)),
            links: links.map(d => Object.assign({}, d))
        });

        // Draw links (ribbons)
        const linkGroup = svg.append('g')
            .attr('class', 'links')
            .attr('fill', 'none');

        linkGroup.selectAll('path')
            .data(sankeyLinks)
            .join('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', d => velocityColors[d.velocity] || velocityColors.medium)
            .attr('stroke-width', d => Math.max(1, d.width))
            .attr('opacity', 0.5)
            .attr('class', 'ribbon-link')
            .style('cursor', 'pointer')
            .on('mousemove', function (event, d) {
                d3.select(this).attr('opacity', 0.8);
                const sourceNode = nodes[d.source.index];
                const targetNode = nodes[d.target.index];
                setTooltip({
                    show: true,
                    x: event.pageX,
                    y: event.pageY,
                    content: `
            <div class="font-semibold mb-1">${sourceNode.name} → ${targetNode.name}</div>
            <div class="text-sm">Ordered: ${d.ordered}</div>
            <div class="text-sm">Delivered: ${d.delivered}</div>
            <div class="text-sm">Time: ${d.timeHours >= 24 ? `${(d.timeHours / 24).toFixed(1)} days` : `${d.timeHours} hours`}</div>
            <div class="text-sm">Velocity: <span class="font-semibold capitalize">${d.velocity}</span></div>
          `
                });
            })
            .on('mouseout', function () {
                d3.select(this).attr('opacity', 0.5);
                setTooltip({ show: false, x: 0, y: 0, content: '' });
            });

        // Draw nodes
        const nodeGroup = svg.append('g')
            .attr('class', 'nodes');

        const node = nodeGroup.selectAll('g')
            .data(sankeyNodes)
            .join('g')
            .attr('class', 'node-group')
            .style('cursor', d => {
                if (d.type === 'supply' && leftLevel < 3 && hospitalSupply[`level${leftLevel + 1}`]?.[d.id]) {
                    return 'pointer';
                }
                if (d.type === 'demand' && rightLevel < 3 && hospitalDemand[`level${rightLevel + 1}`]?.[d.id]) {
                    return 'pointer';
                }
                return 'default';
            })
            .on('click', function (event, d) {
                if (d.type === 'supply' && leftLevel < 3 && hospitalSupply[`level${leftLevel + 1}`]?.[d.id]) {
                    handleLeftClick(d);
                } else if (d.type === 'demand' && rightLevel < 3 && hospitalDemand[`level${rightLevel + 1}`]?.[d.id]) {
                    handleRightClick(d);
                }
            })
            .on('mousemove', function (event, d) {
                setTooltip({
                    show: true,
                    x: event.pageX,
                    y: event.pageY,
                    content: `
            <div class="font-semibold mb-1">${d.name}</div>
            ${d.type === 'supply' ? `<div class="text-sm">In-Stock: ${d.inStock || 0}</div>` : `<div class="text-sm">OTIF: ${d.otif || 0}%</div><div class="text-sm">TAT: ${d.tat || 0}h</div>`}
          `
                });
            })
            .on('mouseout', function () {
                setTooltip({ show: false, x: 0, y: 0, content: '' });
            });

        // Node rectangles - ALL BLUE
        node.append('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('fill', '#3b82f6')
            .attr('stroke', '#1e40af')
            .attr('stroke-width', 2)
            .attr('rx', 4);

        // Node labels - FULLY VISIBLE, NO TRUNCATION
        node.append('text')
            .attr('x', d => d.type === 'supply' ? d.x0 - 8 : d.x1 + 8)
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => d.type === 'supply' ? 'end' : 'start')
            .attr('class', 'text-sm font-semibold fill-gray-700')
            .text(d => d.name);

        // Node info - FULLY VISIBLE
        node.append('text')
            .attr('x', d => d.type === 'supply' ? d.x0 - 8 : d.x1 + 8)
            .attr('y', d => (d.y1 + d.y0) / 2 + 15)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => d.type === 'supply' ? 'end' : 'start')
            .attr('class', 'text-xs fill-gray-500')
            .text(d => {
                if (d.type === 'supply') {
                    return `In-Stock: ${d.inStock || 0}`;
                } else {
                    return `OTIF: ${d.otif || 0}% | TAT: ${d.tat || 0}h`;
                }
            });

    }, [isExpanded, leftLevel, rightLevel, selectedLeftNode, selectedRightNode, getCurrentData, handleLeftClick, handleRightClick]);

    return (
        <>
            {/* Chord Diagram Container */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Supply & Demand Flow</h3>
                        <p className="text-sm text-gray-600 mt-1">Interactive visualization of hospital supply chain</p>
                    </div>
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Maximize2 size={18} />
                        <span>Expand</span>
                    </button>
                </div>

                {/* Movement Speed Legend */}
                <div className="mb-4 flex items-center gap-6 text-sm">
                    <span className="font-semibold text-gray-700">Movement Speed:</span>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1" style={{ backgroundColor: velocityColors.fast }}></div>
                        <span>Fast</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1" style={{ backgroundColor: velocityColors.medium }}></div>
                        <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1" style={{ backgroundColor: velocityColors.slow }}></div>
                        <span>Slow</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-1" style={{ backgroundColor: velocityColors.occasional }}></div>
                        <span>Occasional</span>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {leftBreadcrumb.length > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLeftBack}
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                                >
                                    <ChevronLeft size={16} />
                                    <span>Back (Supply)</span>
                                </button>
                                <div className="text-sm text-gray-600">
                                    {leftBreadcrumb.map((crumb, i) => (
                                        <span key={i}>
                                            {i > 0 && ' > '}
                                            <span className={i === leftBreadcrumb.length - 1 ? 'font-semibold text-blue-600' : ''}>
                                                {crumb.name}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {rightBreadcrumb.length > 1 && (
                            <div className="flex items-center gap-2">
                                <div className="text-sm text-gray-600">
                                    {rightBreadcrumb.map((crumb, i) => (
                                        <span key={i}>
                                            {i > 0 && ' > '}
                                            <span className={i === rightBreadcrumb.length - 1 ? 'font-semibold text-green-600' : ''}>
                                                {crumb.name}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={handleRightBack}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                                >
                                    <span>Back (Demand)</span>
                                    <ChevronLeft size={16} className="rotate-180" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Diagram */}
                <div className="flex justify-center bg-gray-50 rounded-lg p-4 overflow-x-auto">
                    <svg ref={svgRef} className="max-w-full h-auto"></svg>
                </div>

                {/* Bottom Metrics */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-sm text-gray-600">Current Pending Supply</div>
                        <div className="text-3xl font-bold text-blue-700">{chordMetrics.currentPendingSupply}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-sm text-gray-600">Forecast Next Hour</div>
                        <div className="text-3xl font-bold text-green-700">{chordMetrics.forecastNextHour}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-sm text-gray-600">Today Demand</div>
                        <div className="text-3xl font-bold text-purple-700">{chordMetrics.todayDemand}</div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                    Click on nodes to drill down • Hover over flows for details
                </div>
            </div>

            {/* Tooltip */}
            {tooltip.show && (
                <div
                    className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm pointer-events-none"
                    style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
                    dangerouslySetInnerHTML={{ __html: tooltip.content }}
                />
            )}

            {/* Expanded Modal */}
            {isExpanded && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] max-h-[95vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white">Supply & Demand Flow - Expanded View</h3>
                                <p className="text-blue-100 mt-1">Interactive visualization of hospital supply chain</p>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-2 hover:bg-blue-500 rounded-full transition-colors"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
                            <div className="flex justify-center bg-gray-50 rounded-lg p-6 overflow-x-auto">
                                <svg ref={svgRef} className="max-w-full h-auto"></svg>
                            </div>

                            <div className="mt-8 grid grid-cols-3 gap-6">
                                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                                    <div className="text-base text-gray-600">Current Pending Supply</div>
                                    <div className="text-5xl font-bold text-blue-700 mt-2">{chordMetrics.currentPendingSupply}</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                    <div className="text-base text-gray-600">Forecast Next Hour</div>
                                    <div className="text-5xl font-bold text-green-700 mt-2">{chordMetrics.forecastNextHour}</div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
                                    <div className="text-base text-gray-600">Today Demand</div>
                                    <div className="text-5xl font-bold text-purple-700 mt-2">{chordMetrics.todayDemand}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChordDiagram;
