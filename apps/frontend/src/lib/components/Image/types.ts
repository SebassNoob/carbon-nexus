import type { ImgHTMLAttributes } from "react";
import type { ImageProps as NextImageProps } from "next/image";

export interface ImageProps extends NextImageProps {
	src: string;
	skeletonClassName?: string;
}
