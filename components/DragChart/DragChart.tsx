import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import _ from 'lodash'

interface Props {
	data: Array<number>
	height: number
	width: number
	margin: any
	colorTheme: any
	maxValue?: number
	changeData: (data: Array<number>) => void
}

const DragChart = (props: Props) => {
	const ref = useRef(null)
	const {
		data,
		height,
		width,
		margin,
		colorTheme,
		changeData,
		maxValue = _.max(data),
	} = props

	let mappedData
	let x
	let y
	let focus
	let line

	useEffect(() => {
		mappedData = data.map((value: number, index: number) => {
			return [index, value]
		})
		if (ref) {
			d3.select(ref.current).select('svg').remove()
			drawChart(width, height)
		}
	}, [data])

	const drawChart = (width: number, height: number) => {
		const svg = d3
			.select(ref.current)
			.append('svg')
			.attr('width', width)
			.attr('height', height + 100)
		width = width - margin.left - margin.right
		height = height - margin.top - margin.bottom
		const points = mappedData
		x = d3
			.scaleLinear()
			.range([0, width])
			.domain([0, data.length - 1])
		y = d3.scaleLinear().range([height, 0]).domain([0, maxValue])
		let xAxis = d3.axisBottom(x),
			yAxis = d3.axisLeft(y).ticks(5)

		line = d3
			.line()
			.x((d, i) => {
				return x(i)
			})
			.y((d) => {
				return y(d[1])
			})

		const drag = d3
			.drag()
			.on('start', dragstarted)
			.on('drag', dragged)
			.on('end', dragended)

		svg.append('rect')
			.attr('class', 'zoom')
			.attr('cursor', 'move')
			.attr('fill', 'none')
			.attr('pointer-events', 'all')
			.attr('width', width)
			.attr('height', height)
			.attr('transform', `translate(${margin.left},${margin.top})`)

		focus = svg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)

		focus
			.append('path')
			.datum(points)
			.attr('fill', 'none')
			.attr('stroke', colorTheme[0])
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.attr('stroke-width', 1.5)
			.attr('d', line)

		focus
			.selectAll('circle')
			.data(points)
			.enter()
			.append('circle')
			.attr('r', 5.0)
			.attr('cx', (d, i: number) => {
				return x(i)
			})
			.attr('cy', (d) => {
				return y(d[1])
			})
			.style('cursor', 'pointer')
			.style('fill', colorTheme[1])

		focus.selectAll('circle').call(drag)

		focus
			.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', `translate(0,${height})`)
			.call(xAxis)

		focus.append('g').attr('class', 'axis axis--y').call(yAxis)
	}

	function dragstarted() {
		d3.select(this).raise().classed('active', true)
	}

	function dragged(event, datum: number) {
		if (datum[1] < 0 || datum[1] > maxValue) return
		datum[1] = y.invert(event.y)
		datum[1] = datum[1] > maxValue ? maxValue : datum[1] < 0 ? 0 : datum[1]
		d3.select(this).attr('cx', x(datum[0])).attr('cy', y(datum[1]))
		focus.select('path').attr('d', line)
	}

	function dragended(e, d) {
		data[d[0]] = d[1]
		changeData(data)
		d3.select(this).classed('active', false)
	}

	return <div ref={ref} />
}

export default DragChart
