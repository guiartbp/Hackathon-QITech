'use client';

import React from 'react';
import { motion } from 'framer-motion';

type GradientDotsProps = React.ComponentProps<typeof motion.div> & {
	/** Dot size (default: 8) */
	dotSize?: number;
	/** Spacing between dots (default: 10) */
	spacing?: number;
	/** Animation duration (default: 30) */
	duration?: number;
	/** Color cycle duration (default: 6) */
	colorCycleDuration?: number;
	/** Background color (default: 'var(--background)') */
	backgroundColor?: string;
	/** Color scheme (default: 'default') */
	colorScheme?: 'default' | 'orange-red' | 'black-orange';
};

export function GradientDotsOrange({
	dotSize = 8,
	spacing = 10,
	duration = 30,
	colorCycleDuration = 6,
	backgroundColor = 'transparent',
	colorScheme = 'orange-red',
	className,
	...props
}: GradientDotsProps) {
	const hexSpacing = spacing * 1.732; // Hexagonal spacing calculation

	const getColorScheme = () => {
		switch (colorScheme) {
			case 'orange-red':
				return {
					colors: '#ff4500, #ff6b35, #f7931e, #ff8c00',
					gradients: `
						radial-gradient(circle at 50% 50%, #ff4500, transparent 60%),
						radial-gradient(circle at 50% 50%, #ff6b35, transparent 60%),
						radial-gradient(circle at 50% 50%, #f7931e, transparent 60%),
						radial-gradient(ellipse at 50% 50%, #ff8c00, transparent 60%)
					`
				};
			case 'black-orange':
				return {
					colors: '#000000, #ff4500, #ff6b35, #1a1a1a',
					gradients: `
						radial-gradient(circle at 50% 50%, #ff4500, transparent 60%),
						radial-gradient(circle at 50% 50%, #ff6b35, transparent 60%),
						radial-gradient(circle at 50% 50%, #000000, transparent 60%),
						radial-gradient(ellipse at 50% 50%, #1a1a1a, transparent 60%)
					`
				};
			default:
				return {
					colors: '#f00, #ff0, #0f0, #00f',
					gradients: `
						radial-gradient(circle at 50% 50%, #f00, transparent 60%),
						radial-gradient(circle at 50% 50%, #ff0, transparent 60%),
						radial-gradient(circle at 50% 50%, #0f0, transparent 60%),
						radial-gradient(ellipse at 50% 50%, #00f, transparent 60%)
					`
				};
		}
	};

	const { gradients } = getColorScheme();

	return (
		<motion.div
			className={`absolute inset-0 ${className}`}
			style={{
				backgroundColor,
				backgroundImage: `
					radial-gradient(circle at 50% 50%, transparent 1.5px, ${backgroundColor} 0 ${dotSize}px, transparent ${dotSize}px),
					radial-gradient(circle at 50% 50%, transparent 1.5px, ${backgroundColor} 0 ${dotSize}px, transparent ${dotSize}px),
					${gradients}
				`,
				backgroundSize: `
					${spacing}px ${hexSpacing}px,
					${spacing}px ${hexSpacing}px,
					200% 200%,
					200% 200%,
					200% 200%,
					200% ${hexSpacing}px
				`,
				backgroundPosition: `
					0px 0px, ${spacing / 2}px ${hexSpacing / 2}px,
					0% 0%,
					0% 0%,
					0% 0px
				`,
			}}
			animate={{
				backgroundPosition: [
					`0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 800% 400%, 1000% -400%, -1200% -600%, 400% ${hexSpacing}px`,
					`0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 0% 0%, 0% 0%, 0% 0%, 0% 0%`,
				],
				filter: ['hue-rotate(0deg)', 'hue-rotate(45deg)', 'hue-rotate(0deg)'],
			}}
			transition={{
				backgroundPosition: {
					duration: duration,
					ease: 'linear',
					repeat: Number.POSITIVE_INFINITY,
				},
				filter: {
					duration: colorCycleDuration,
					ease: 'linear',
					repeat: Number.POSITIVE_INFINITY,
				},
			}}
			{...props}
		/>
	);
}