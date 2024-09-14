"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { default as NextImage } from "next/image";
import type { ImageProps } from "./types";

const defaultSkeletonStyle = "w-full h-full animate-pulse bg-gray-300 dark:bg-gray-700";

export function Image({ src, alt, className, skeletonClassName, ...rest }: ImageProps) {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	const mergedSkeletonStyles = twMerge(defaultSkeletonStyle, skeletonClassName);
	const mergedStyles = twMerge(loaded ? "" : "hidden", className);

	if (error) {
		console.error(`Failed to load image: ${src}`);
		return null;
	}

	return (
		<>
			{!loaded && <div className={mergedSkeletonStyles} />}
			<NextImage
				src={src}
				alt={alt ?? ""}
				fill={true}
				onLoad={() => setLoaded(true)}
				onError={() => setError(true)}
				className={mergedStyles}
				{...rest}
			/>
		</>
	);
}

export default Image;
